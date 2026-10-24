/**
 * Authentication and Authorization Middleware
 * Validates Supabase JWT access tokens & platform JWTs, and enforces Role-Based Access Control (RBAC)
 */

import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/db.js';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * Authenticate incoming HTTP request via Bearer JWT token or cookie
 * Attaches the verified user record to req.user
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token && req.cookies) {
    token = req.cookies.herearn_access_token || req.cookies['sb-access-token'] || null;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
      code: 'NO_TOKEN',
    });
  }

  try {
    let user = null;

    // 1. Try Supabase Auth verification
    if (supabaseAdmin && supabaseAdmin.auth) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (!error && data && data.user) {
          const sbUser = data.user;
          const cleanEmail = sbUser.email ? sbUser.email.toLowerCase().trim() : null;

          if (cleanEmail) {
            user = await prisma.user.findFirst({
              where: {
                OR: [
                  { email: cleanEmail },
                  { id: sbUser.id },
                ],
              },
            }).catch(() => null);

            if (!user) {
              const meta = sbUser.user_metadata || {};
              const rawName = meta.full_name || meta.name || cleanEmail.split('@')[0] || 'Learner';
              const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
              const avatar =
                meta.avatar_url ||
                meta.picture ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`;

              user = await prisma.user.create({
                data: {
                  id: sbUser.id,
                  name: formattedName,
                  email: cleanEmail,
                  passwordHash: 'supabase_oauth_managed_account',
                  role: 'LEARNER',
                  avatar,
                  location: 'India',
                  bio: 'Verified HerEarn Learner via Supabase Auth',
                  skills: ['Digital Marketing', 'Graphic Design'],
                },
              }).catch(() => null);
            }
          }
        }
      } catch {
        // Supabase check failed, try internal
      }
    }

    // 2. Try Internal JWT verification
    if (!user) {
      try {
        const decoded = verifyToken(token);
        const userId = decoded.userId || decoded.id || decoded.sub;
        if (userId) {
          user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
              phone: true,
              location: true,
              bio: true,
              skills: true,
              totalEarned: true,
            },
          });
        }
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Authentication token has expired. Please log in again.',
            code: 'TOKEN_EXPIRED',
          });
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.',
        code: 'INVALID_TOKEN',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.',
      error: error.message,
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts route access to specific user roles
 *
 * @param {...string} allowedRoles - Allowed role strings (e.g., 'ADMIN', 'EMPLOYER', 'LEARNER')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to role verification.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: [${allowedRoles.join(', ')}].`,
      });
    }

    next();
  };
};

/**
 * Resource Ownership Verification Middleware
 * Ensures the authenticated user owns the resource, or has an ADMIN role
 *
 * @param {string} userIdParamName - The name of the route parameter containing the owner's userId
 */
export const requireOwnership = (userIdParamName = 'userId') => {
  return (req, res, next) => {
    const targetUserId = req.params[userIdParamName];

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Admins bypass ownership checks
    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (req.user.id !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to modify another user\'s resource.',
      });
    }

    next();
  };
};

/**
 * Optional Authentication Middleware
 * Populates req.user if a valid token is provided, without rejecting anonymous requests
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token && req.cookies) {
    token = req.cookies.herearn_access_token || req.cookies['sb-access-token'] || null;
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    if (decoded && (decoded.id || decoded.userId || decoded.sub)) {
      const targetId = decoded.id || decoded.userId || decoded.sub;
      const user = await prisma.user.findUnique({ where: { id: targetId } }).catch(() => null);
      req.user = user || null;
    }
  } catch {
    req.user = null;
  }

  next();
};

export const authMiddleware = authenticateToken;
export const optionalAuthMiddleware = optionalAuth;

export default {
  authenticateToken,
  authMiddleware,
  optionalAuth,
  optionalAuthMiddleware,
  requireRole,
  requireOwnership,
};

