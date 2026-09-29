/**
 * User Applications Management Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/applications/me
 * @desc    Get all applications submitted by authenticated user
 * @access  Protected
 */
router.get(
  '/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: {
        opportunity: true,
        attachedProjects: {
          include: { project: true },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const formatted = applications.map((app) => ({
      id: app.id,
      opportunityId: app.opportunityId,
      opportunityTitle: app.opportunity.title,
      company: app.opportunity.company,
      logo: app.opportunity.logo,
      stipend: app.opportunity.stipend,
      type: app.opportunity.type,
      category: app.opportunity.category,
      coverNote: app.coverNote,
      status: app.status,
      appliedAt: app.appliedAt,
      attachedProjects: (app.attachedProjects || []).map((ap) => ap.project),
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      applications: formatted,
    });
  })
);

/**
 * @route   GET /api/applications/:id
 * @desc    Get single application details
 * @access  Protected (Owner or Employer/Admin)
 */
router.get(
  '/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        opportunity: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            location: true,
            bio: true,
          },
        },
        attachedProjects: {
          include: { project: true },
        },
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (
      application.userId !== req.user.id &&
      req.user.role !== 'EMPLOYER' &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this application',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  })
);

export default router;
