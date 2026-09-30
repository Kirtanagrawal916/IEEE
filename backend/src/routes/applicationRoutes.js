import express from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const applyHandler = async (req, res) => {
  try {
    const opportunityId = req.params.id;
    const { coverNote, portfolioProjectIds, portfolioId, quizSummary } = req.body;

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

    // Handle portfolio attachments via applicationProjects junction
    const projIds = portfolioProjectIds || (portfolioId ? [portfolioId] : []);
    if (Array.isArray(projIds)) {
      for (const projId of projIds) {
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
};

const getMyApplicationsHandler = async (req, res) => {
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
      opportunityTitle: app.opportunity ? app.opportunity.title : '',
      company: app.opportunity ? app.opportunity.company : '',
      logo: app.opportunity ? app.opportunity.logo : null,
      stipend: app.opportunity ? app.opportunity.stipend : '',
      type: app.opportunity ? app.opportunity.type : '',
      category: app.opportunity ? app.opportunity.category : '',
      coverNote: app.coverNote,
      status: app.status,
      appliedAt: app.appliedAt,
      attachedProjects: (app.applicationProjects || []).map((ap) => ({
        ...ap.project,
        tags: typeof ap.project.tags === 'string' ? JSON.parse(ap.project.tags || '[]') : (ap.project.tags || []),
      })),
    }));

    res.json({ success: true, count: formatted.length, applications: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
  }
};

const getApplicationByIdHandler = async (req, res) => {
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
};

// Route mappings for opportunities apply and user applications
router.post('/opportunities/:id/apply', authenticateToken, applyHandler);

router.get('/applications/me', authenticateToken, getMyApplicationsHandler);
router.get('/applications/mine', authenticateToken, getMyApplicationsHandler);
router.get('/applications/:id', authenticateToken, getApplicationByIdHandler);

export default router;
