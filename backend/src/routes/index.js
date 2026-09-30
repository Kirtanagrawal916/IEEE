/**
 * Main API Router Aggregator
 * Mounts system health and all feature route controllers
 */

import { Router } from 'express';
import prisma from '../config/db.js';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import trackRoutes from './trackRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import progressRoutes from './progressRoutes.js';
import portfolioRoutes from './portfolioRoutes.js';
import opportunityRoutes from './opportunityRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    System health check & database connectivity probe
 * @access  Public
 */
router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
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

// Feature Routes Mounting (Sections 9, 20: BE-03 to BE-09)
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tracks', trackRoutes);
router.use('/lessons', lessonRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/progress', progressRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/', applicationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chat', chatRoutes);

export default router;
