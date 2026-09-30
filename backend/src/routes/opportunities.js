/**
 * Income Opportunities & Opportunity Application Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/opportunities
 * @desc    Get filtered list of open micro-gigs & internships
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, skill, search, type } = req.query;

    const where = { isOpen: true };

    if (category && category !== 'All Categories') {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    let formatted = [...opportunities];

    if (skill) {
      formatted = formatted.filter((g) =>
        Array.isArray(g.skillsRequired) &&
        g.skillsRequired.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    if (search) {
      const q = search.toLowerCase();
      formatted = formatted.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.company.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: formatted.length,
      opportunities: formatted,
    });
  })
);

/**
 * @route   GET /api/opportunities/:id
 * @desc    Get opportunity details by ID
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: req.params.id },
    });

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    res.status(200).json({
      success: true,
      opportunity,
    });
  })
);

/**
 * @route   POST /api/opportunities/:id/apply
 * @desc    Apply to an opportunity with cover note and optional attached portfolio projects
 * @access  Protected
 */
router.post(
  '/:id/apply',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const opportunityId = req.params.id;
    const { coverNote, portfolioProjectIds } = req.body;

    if (!coverNote || !coverNote.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Cover note is required',
      });
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    if (!opportunity.isOpen) {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is closed',
      });
    }

    // Check duplicate application
    const existingApp = await prisma.application.findUnique({
      where: {
        opportunityId_userId: {
          opportunityId,
          userId: req.user.id,
        },
      },
    });

    if (existingApp) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this opportunity',
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        opportunityId,
        userId: req.user.id,
        coverNote: coverNote.trim(),
        status: 'SUBMITTED',
      },
    });

    // Attach valid portfolio projects
    if (portfolioProjectIds && Array.isArray(portfolioProjectIds)) {
      for (const projId of portfolioProjectIds) {
        // Verify project ownership before linking
        const project = await prisma.portfolioProject.findUnique({
          where: { id: projId },
        });

        if (project && project.userId === req.user.id) {
          await prisma.applicationProject.create({
            data: {
              applicationId: application.id,
              projectId: projId,
            },
          }).catch(() => {});
        }
      }
    }

    // Increment applicant count
    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { applicantsCount: { increment: 1 } },
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  })
);

export default router;
