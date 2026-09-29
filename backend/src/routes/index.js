/**
 * Main API Router Aggregator
 * Mounts the system health endpoint and establishes standard mount paths
 * for feature route controllers implemented by team members.
 */

import { Router } from 'express';
import prisma from '../config/db.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    System health check & database connectivity probe
 * @access  Public
 */
router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    // Quick probe to verify Prisma database connectivity
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = `unreachable: ${error.message}`;
  }

  res.status(200).json({
    success: true,
    service: 'HerEarn Backend API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStatus,
  });
});

/**
 * =========================================================================
 * TEAMMATE ROUTE MOUNTING POINTS (Sections 9, 20: BE-03 to BE-09)
 *
 * Import and mount the respective routers here once your teammate creates them:
 *
 * Example:
 * import authRoutes from './authRoutes.js';
 * import userRoutes from './userRoutes.js';
 * import trackRoutes from './trackRoutes.js';
 * import lessonRoutes from './lessonRoutes.js';
 * import enrollmentRoutes from './enrollmentRoutes.js';
 * import progressRoutes from './progressRoutes.js';
 * import portfolioRoutes from './portfolioRoutes.js';
 * import opportunityRoutes from './opportunityRoutes.js';
 * import applicationRoutes from './applicationRoutes.js';
 * import dashboardRoutes from './dashboardRoutes.js';
 *
 * router.use('/auth', authRoutes);
 * router.use('/users', userRoutes);
 * router.use('/tracks', trackRoutes);
 * router.use('/lessons', lessonRoutes);
 * router.use('/enrollments', enrollmentRoutes);
 * router.use('/progress', progressRoutes);
 * router.use('/portfolio', portfolioRoutes);
 * router.use('/opportunities', opportunityRoutes);
 * router.use('/applications', applicationRoutes);
 * router.use('/dashboard', dashboardRoutes);
 * =========================================================================
 */

export default router;
