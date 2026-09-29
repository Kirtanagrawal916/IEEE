/**
 * Main API Router Aggregator
 * Mounts system health and all domain feature routers:
 * /api/auth, /api/users, /api/tracks, /api/lessons, /api/enrollments,
 * /api/progress, /api/portfolio, /api/opportunities, /api/applications, /api/dashboard
 */

import { Router } from 'express';
import prisma from '../config/db.js';

import authRoutes from './auth.js';
import userRoutes from './users.js';
import trackRoutes from './tracks.js';
import lessonRoutes from './lessons.js';
import enrollmentRoutes from './enrollments.js';
import progressRoutes from './progress.js';
import portfolioRoutes from './portfolio.js';
import opportunityRoutes from './opportunities.js';
import applicationRoutes from './applications.js';
import dashboardRoutes from './dashboard.js';

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

// Mount Feature Routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tracks', trackRoutes);
router.use('/lessons', lessonRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/progress', progressRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/applications', applicationRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
