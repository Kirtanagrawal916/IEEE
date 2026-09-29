/**
 * Authentication Utilities Unit Tests
 * Tests password hashing (bcrypt) and JWT signing/verification
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { hashPassword, comparePassword } from '../src/utils/password.js';
import { generateToken, verifyToken } from '../src/utils/jwt.js';

describe('Security & Authentication Utilities', () => {
  describe('Password Hashing (bcrypt)', () => {
    test('should hash plain password and return a different string', async () => {
      const plain = 'StrongPass123!';
      const hash = await hashPassword(plain);

      assert.notStrictEqual(hash, plain);
      assert.strictEqual(typeof hash, 'string');
      assert.ok(hash.startsWith('$2')); // bcrypt identifier
    });

    test('should return true for correct password comparison', async () => {
      const plain = 'AnotherSecretPassword!';
      const hash = await hashPassword(plain);

      const isValid = await comparePassword(plain, hash);
      assert.strictEqual(isValid, true);
    });

    test('should return false for incorrect password comparison', async () => {
      const plain = 'CorrectPassword!';
      const hash = await hashPassword(plain);

      const isValid = await comparePassword('WrongPassword!', hash);
      assert.strictEqual(isValid, false);
    });
  });

  describe('JWT Signing and Verification', () => {
    test('should sign payload and decode accurately', () => {
      const userPayload = {
        id: 'user-uuid-1234',
        email: 'test@herearn.org',
        role: 'LEARNER',
      };

      const token = generateToken(userPayload, '1h');
      assert.strictEqual(typeof token, 'string');

      const decoded = verifyToken(token);
      assert.strictEqual(decoded.id, userPayload.id);
      assert.strictEqual(decoded.email, userPayload.email);
      assert.strictEqual(decoded.role, userPayload.role);
    });

    test('should throw error when verifying invalid token', () => {
      assert.throws(() => {
        verifyToken('invalid.token.structure');
      });
    });
  });
});
