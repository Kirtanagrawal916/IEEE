/**
 * Centralized Environment Configuration & Validation
 * Loads .env variables and provides typed fallbacks
 */

import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'herearn-dev-secret-key-replace-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
};

// Validate critical secrets in production mode
if (env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) {
    throw new Error('FATAL: DATABASE_URL environment variable is required in production.');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('replace-in-production')) {
    throw new Error('FATAL: A strong, unique JWT_SECRET is required in production.');
  }
}
