/**
 * JWT (JSON Web Token) Generation and Verification Utilities
 * Used for stateless user authentication and authorization
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate a signed JWT token for an authenticated user
 * @param {Object} payload - User data to embed in token (id, email, role)
 * @param {string} [expiresIn] - Optional custom expiry duration
 * @returns {string} Signed JWT token string
 */
export const generateToken = (payload, expiresIn = env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Synchronously verify and decode a JWT token
 * @param {string} token - Bearer JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export default {
  generateToken,
  verifyToken,
};
