/**
 * Password Hashing and Comparison Utilities
 * Uses bcryptjs with a cost factor of 10 for secure one-way password storage
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt
 * @param {string} password - Raw password entered by user
 * @returns {Promise<string>} Secure salted hash string
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password against a stored bcrypt hash
 * @param {string} plainPassword - Plain text candidate password
 * @param {string} hashedPassword - Stored bcrypt hash string
 * @returns {Promise<boolean>} True if match, false otherwise
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export default {
  hashPassword,
  comparePassword,
};
