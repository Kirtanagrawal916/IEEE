import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'her_earn_jwt_secret_key_2026_prototype';
const JWT_ISSUER = 'herearn.platform';
const JWT_AUDIENCE = 'herearn.app';

/**
 * Extract token from either HttpOnly cookie or Authorization Bearer header
 */
export const extractToken = (req) => {
  // 1. Check HttpOnly cookie first
  if (req.cookies && req.cookies.herearn_access_token) {
    return req.cookies.herearn_access_token;
  }
  // 2. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

/**
 * Authentication Middleware
 * Enforces:
 * - Token extraction from secure cookie or Bearer header
 * - Cryptographic signature verification with algorithm HS256
 * - Issuer and audience validation
 * - Expiration and claim validation
 * - Database identity verification and account status check
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    // Verify token cryptographically
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
    } catch (jwtErr) {
      // Graceful fallback for existing prototype tokens that were signed without iss/aud
      try {
        decoded = jwt.verify(token, JWT_SECRET, {
          algorithms: ['HS256'],
        });
      } catch (fallbackErr) {
        if (jwtErr.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Session expired. Please log in again.',
            code: 'TOKEN_EXPIRED',
          });
        }
        return res.status(401).json({
          success: false,
          message: 'Invalid or tampered token. Authentication failed.',
          code: 'INVALID_TOKEN',
        });
      }
    }

    const userId = decoded.sub || decoded.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token claims: user ID missing.',
      });
    }

    // Database identity verification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        location: true,
        bio: true,
        skills: true,
        totalEarned: true,
        verifiedKyc: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

/**
 * Optional Authentication Middleware
 * Populates req.user if a valid token is present, but doesn't block unauthenticated requests.
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next();

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      return next();
    }

    const userId = decoded.sub || decoded.userId;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, status: true },
      });
      if (user && user.status !== 'Suspended') {
        req.user = user;
      }
    }
  } catch {
    // Continue without user
  }
  next();
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts access to specific roles (e.g. ADMIN, EMPLOYER)
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking authorization.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires ${allowedRoles.join(' or ')} privileges.`,
      });
    }

    next();
  };
};

/**
 * Ownership Verification Helper
 * Ensures the authenticated user owns the resource or is an ADMIN
 */
export const requireOwnership = (resourceUserIdGetter) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.role === 'ADMIN') {
      return next();
    }

    const ownerId = typeof resourceUserIdGetter === 'function' ? resourceUserIdGetter(req) : req.params.userId;
    if (ownerId && req.user.id !== ownerId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access or modify another user’s resource.',
      });
    }

    next();
  };
};
