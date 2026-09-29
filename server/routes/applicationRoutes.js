import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/opportunities/:id/apply
router.post('/opportunities/:id/apply', authMiddleware, async (req, res) => {
  try {
    const opportunityId = req.params.id;
    const { coverNote, portfolioProjectIds } = req.body;

    if (!coverNote) {
      return res.status(400).json({ success: false, message: 'Cover note is required' });
    }

    const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    if (!opportunity.isOpen) {
      return res.status(400).json({ success: false, message: 'This opportunity is closed' });
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
      return res.status(409).json({ success: false, message: 'You have already applied to this opportunity' });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        opportunityId,
        userId: req.user.id,
        coverNote,
        status: 'SUBMITTED',
      },
    });

    // Attach portfolio projects if passed
    if (portfolioProjectIds && Array.isArray(portfolioProjectIds)) {
      for (const projId of portfolioProjectIds) {
        await prisma.applicationProject.create({
          data: {
            applicationId: application.id,
            projectId: projId,
          },
        }).catch(() => {});
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit application', error: error.message });
  }
});

// GET /api/applications/me
router.get('/applications/me', authMiddleware, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: {
        opportunity: true,
        applicationProjects: {
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
      attachedProjects: app.applicationProjects.map((ap) => ({
        ...ap.project,
        tags: JSON.parse(ap.project.tags || '[]'),
      })),
    }));

    res.json({ success: true, count: formatted.length, applications: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
  }
});

// GET /api/applications/:id
router.get('/applications/:id', authMiddleware, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        opportunity: true,
        user: { select: { id: true, name: true, email: true, avatar: true, location: true } },
        applicationProjects: { include: { project: true } },
      },
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.userId !== req.user.id && req.user.role !== 'EMPLOYER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch application details', error: error.message });
  }
});

export default router;
