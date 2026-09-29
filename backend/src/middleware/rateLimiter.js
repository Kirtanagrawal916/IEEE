/**
 * Rate Limiting Middleware
 * Protects endpoints from Denial-of-Service (DoS) and brute-force authentication attacks
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * Standard API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

/**
 * Strict authentication limiter for login and registration attempts
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/registration attempts from this IP. Please try again after 15 minutes.',
  },
});

export default {
  apiLimiter,
  authLimiter,
};
