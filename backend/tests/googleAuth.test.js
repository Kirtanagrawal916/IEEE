/**
 * Google Authentication & Account Linking Integration Tests
 * Validates Google ID token processing, account creation, and seamless linking with existing accounts
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/db.js';
import { verifyGoogleToken } from '../src/utils/googleAuth.js';
import { hashPassword } from '../src/utils/password.js';

describe('Google Authentication & Account Linking Suite', { concurrency: 1 }, () => {
  let server;
  let baseUrl;

  const testTimestamp = Date.now();
  const newGoogleEmail = `google.newuser.${testTimestamp}@example.com`;
  const existingEmail = `existing.hybrid.${testTimestamp}@example.com`;
  let existingUserId = '';

  before(async () => {
    // 1. Start HTTP Server on ephemeral port
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });

    // 2. Seed an existing email/password user to test account linking
    const passwordHash = await hashPassword('PreExistingPass123!');
    const preExistingUser = await prisma.user.create({
      data: {
        name: 'Pre-existing Member',
        email: existingEmail,
        passwordHash,
        role: 'LEARNER',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        location: 'Mumbai, India',
        bio: 'Established learner before Google auth was linked',
        skills: ['Graphic Design', 'Social Media'],
      },
    });
    existingUserId = preExistingUser.id;
  });

  after(async () => {
    // Clean up created test users
    try {
      await prisma.user.deleteMany({
        where: {
          email: {
            in: [newGoogleEmail, existingEmail],
          },
        },
      });
    } catch (e) {
      // ignore cleanup errors
    }

    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe('Google Token Utility Tests', () => {
    test('verifyGoogleToken should fail when token is missing or empty', async () => {
      await assert.rejects(
        async () => {
          await verifyGoogleToken('');
        },
        {
          message: 'Google credential token is required.',
        }
      );
    });

    test('verifyGoogleToken resolves verified payload for valid mock credential in test mode', async () => {
      const mockToken = `mock-google-token-test:${newGoogleEmail}:Aarohi Patel`;
      const payload = await verifyGoogleToken(mockToken);

      assert.strictEqual(payload.email, newGoogleEmail);
      assert.strictEqual(payload.name, 'Aarohi Patel');
      assert.strictEqual(payload.email_verified, true);
      assert.ok(payload.sub);
    });
  });

  describe('POST /api/auth/google Endpoint', () => {
    test('should reject request when credential is missing', async () => {
      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      assert.strictEqual(res.status, 400);
      assert.strictEqual(data.success, false);
      assert.ok(data.message.includes('credential token is required'));
    });

    test('should reject invalid/malformed Google token in production mode', async () => {
      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: 'totally.invalid.token' }),
      });

      const data = await res.json();
      assert.strictEqual(res.status, 401);
      assert.strictEqual(data.success, false);
    });

    test('should create a brand new HerEarn user and return HerEarn JWT for new Google account', async () => {
      const mockToken = `mock-google-token-test:${newGoogleEmail}:Aarohi Patel`;

      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: mockToken }),
      });

      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.success, true);
      assert.ok(data.token, 'Should issue standard HerEarn JWT');
      assert.strictEqual(data.user.email, newGoogleEmail);
      assert.strictEqual(data.user.name, 'Aarohi Patel');
      assert.strictEqual(data.user.role, 'LEARNER');

      // Verify user exists in PostgreSQL
      const userInDb = await prisma.user.findUnique({ where: { email: newGoogleEmail } });
      assert.ok(userInDb);
      assert.strictEqual(userInDb.email, newGoogleEmail);
    });

    test('should safely link and log into existing account without duplicating users', async () => {
      const mockToken = `mock-google-token-test:${existingEmail}:Pre-existing Member`;

      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: mockToken }),
      });

      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.user.id, existingUserId, 'Should retain original user ID');
      assert.strictEqual(data.user.email, existingEmail);
      assert.strictEqual(data.user.bio, 'Established learner before Google auth was linked', 'Preserve existing profile bio');
      assert.deepStrictEqual(data.user.skills, ['Graphic Design', 'Social Media'], 'Preserve existing profile skills');

      // Verify no duplicate users were created in DB
      const count = await prisma.user.count({ where: { email: existingEmail } });
      assert.strictEqual(count, 1, 'Email must remain unique with no duplicate user entries');
    });

    test('should allow user authenticated via Google to access protected GET /api/auth/me', async () => {
      const mockToken = `mock-google-token-test:${existingEmail}:Pre-existing Member`;

      // 1. Authenticate with Google
      const authRes = await fetch(`${baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: mockToken }),
      });
      const authData = await authRes.json();
      const jwtToken = authData.token;

      // 2. Fetch /api/auth/me using issued JWT
      const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const meData = await meRes.json();
      assert.strictEqual(meRes.status, 200);
      assert.strictEqual(meData.success, true);
      assert.strictEqual(meData.user.id, existingUserId);
      assert.strictEqual(meData.user.email, existingEmail);
    });
  });
});
