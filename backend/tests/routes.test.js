/**
 * End-to-End API Route Tests for Backend B
 * Tests all migrated domain routes:
 * - Auth (register, login, invalid login, /auth/me)
 * - Tracks (list, details)
 * - Opportunities (list, filter)
 * - User Profile (/users/me)
 * - Dashboard (/dashboard)
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app.js';

describe('HerEarn Backend B Feature Routes', () => {
  let server;
  let baseUrl;
  let testUserToken = '';
  let testUserId = '';
  const uniqueSuffix = Date.now();
  const testEmail = `tester_${uniqueSuffix}@herearn.org`;
  const testPassword = 'Password123!';

  before(async () => {
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  // ----------------------------------------------------
  // AUTH ROUTE TESTS
  // ----------------------------------------------------
  describe('Auth Flow', () => {
    test('POST /api/auth/register creates user and returns JWT token', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Priya Test',
          email: testEmail,
          password: testPassword,
          location: 'Pune',
          bio: 'Learner in test suite',
          skills: ['Digital Marketing', 'Canva'],
        }),
      });

      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.token);
      assert.strictEqual(data.user.email, testEmail);
      assert.strictEqual(data.user.name, 'Priya Test');
      assert.ok(Array.isArray(data.user.skills));

      testUserToken = data.token;
      testUserId = data.user.id;
    });

    test('POST /api/auth/register rejects duplicate email', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate Test',
          email: testEmail,
          password: testPassword,
        }),
      });

      assert.strictEqual(res.status, 409);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    test('POST /api/auth/login authenticates registered user', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.token);
      assert.strictEqual(data.user.email, testEmail);
    });

    test('POST /api/auth/login rejects incorrect password', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'WrongPassword!',
        }),
      });

      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    test('GET /api/auth/me returns authenticated user details', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${testUserToken}` },
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.user.email, testEmail);
    });

    test('GET /api/auth/me rejects missing token', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`);
      assert.strictEqual(res.status, 401);
    });
  });

  // ----------------------------------------------------
  // USER PROFILE TESTS
  // ----------------------------------------------------
  describe('User Profile', () => {
    test('GET /api/users/me returns profile info', async () => {
      const res = await fetch(`${baseUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${testUserToken}` },
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.user.email, testEmail);
    });

    test('PATCH /api/users/me updates profile info', async () => {
      const res = await fetch(`${baseUrl}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserToken}`,
        },
        body: JSON.stringify({
          bio: 'Updated Bio for Test User',
          location: 'Bangalore, India',
          skills: ['React', 'Tailwind', 'Design'],
        }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.user.bio, 'Updated Bio for Test User');
      assert.deepStrictEqual(data.user.skills, ['React', 'Tailwind', 'Design']);
    });
  });

  // ----------------------------------------------------
  // TRACKS & LESSONS TESTS
  // ----------------------------------------------------
  describe('Tracks & Opportunities Discovery', () => {
    test('GET /api/tracks returns array of tracks', async () => {
      const res = await fetch(`${baseUrl}/api/tracks`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(Array.isArray(data.tracks));
    });

    test('GET /api/opportunities returns opportunities list', async () => {
      const res = await fetch(`${baseUrl}/api/opportunities`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(Array.isArray(data.opportunities));
    });
  });

  // ----------------------------------------------------
  // PORTFOLIO TESTS
  // ----------------------------------------------------
  describe('Portfolio Management', () => {
    let createdProjectId = '';

    test('POST /api/portfolio creates a showcase project', async () => {
      const res = await fetch(`${baseUrl}/api/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserToken}`,
        },
        body: JSON.stringify({
          title: 'Instagram Launch Campaign',
          category: 'Marketing',
          description: 'Designed social media banners for local bakery.',
          tags: ['Canva', 'Instagram'],
        }),
      });

      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.project.title, 'Instagram Launch Campaign');
      assert.ok(data.project.id);
      createdProjectId = data.project.id;
    });

    test('GET /api/portfolio/me returns user portfolio projects', async () => {
      const res = await fetch(`${baseUrl}/api/portfolio/me`, {
        headers: { Authorization: `Bearer ${testUserToken}` },
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.projects.length >= 1);
    });

    test('PATCH /api/portfolio/:id updates project', async () => {
      const res = await fetch(`${baseUrl}/api/portfolio/${createdProjectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserToken}`,
        },
        body: JSON.stringify({
          title: 'Updated Campaign Title',
        }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.project.title, 'Updated Campaign Title');
    });

    test('DELETE /api/portfolio/:id removes project', async () => {
      const res = await fetch(`${baseUrl}/api/portfolio/${createdProjectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${testUserToken}` },
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
    });
  });

  // ----------------------------------------------------
  // DASHBOARD TESTS
  // ----------------------------------------------------
  describe('Dashboard Metrics', () => {
    test('GET /api/dashboard returns aggregated user metrics', async () => {
      const res = await fetch(`${baseUrl}/api/dashboard`, {
        headers: { Authorization: `Bearer ${testUserToken}` },
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.dashboard);
      assert.ok(data.dashboard.user);
      assert.ok(data.dashboard.stats);
      assert.ok(data.dashboard.learning);
      assert.ok(data.dashboard.portfolio);
      assert.ok(data.dashboard.applications);
      assert.ok(typeof data.dashboard.user.profileCompletionPercent === 'number');
    });
  });
});
