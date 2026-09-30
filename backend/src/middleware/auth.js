/**
 * Authentication and Authorization Middleware
 * Validates JWT tokens and enforces Role-Based Access Control (RBAC)
 */

import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/db.js';

/**
 * Authenticate incoming HTTP request via Bearer JWT token
 * Attaches the verified user record to req.user
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.',
      });
    }

    // Database verification to ensure user exists and load profile fields
    const user = await prisma.user.findUnique({
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

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User account not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please log in again.',
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Invalid authentication token.',
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

export default {
  authenticateToken,
  requireRole,
  requireOwnership,
};
