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

// GET /api/applications/me or /api/applications/mine
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
      opportunityTitle: app.opportunity.title,
      company: app.opportunity.company,
      logo: app.opportunity.logo,
      stipend: app.opportunity.stipend,
      type: app.opportunity.type,
      category: app.opportunity.category,
      coverNote: app.coverNote,
      status: app.status,
      deliveryStatus: app.deliveryStatus || 'NOT_STARTED',
      deliverableUrl: app.deliverableUrl,
      deliverableNotes: app.deliverableNotes,
      submittedAt: app.submittedAt,
      interviewTime: app.interviewTime,
      interviewLink: app.interviewLink,
      interviewStatus: app.interviewStatus || 'NONE',
      rating: app.rating,
      reviewText: app.reviewText,
      reviewAuthor: app.reviewAuthor,
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
};

router.get('/applications/me', authMiddleware, getMyApplicationsHandler);
router.get('/applications/mine', authMiddleware, getMyApplicationsHandler);

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

// POST /api/applications/:id/deliverable - Submit deliverable url and notes (Applicant)
router.post('/applications/:id/deliverable', authMiddleware, async (req, res) => {
  try {
    const { deliverableUrl, deliverableNotes } = req.body;
    if (!deliverableUrl || typeof deliverableUrl !== 'string' || !deliverableUrl.trim()) {
      return res.status(400).json({ success: false, message: 'A valid project deliverable link is required.' });
    }

    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { opportunity: true },
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'You can only submit deliverables for your own application.' });
    }

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: {
        deliverableUrl: deliverableUrl.trim(),
        deliverableNotes: (deliverableNotes || '').trim(),
        deliveryStatus: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'DELIVERABLE_SUBMITTED',
        detail: `User submitted deliverable for ${application.opportunity?.title || 'Gig'}: ${deliverableUrl.trim()}`,
        type: 'approval',
      },
    }).catch(() => {});

    res.json({
      success: true,
      message: 'Deliverable submitted successfully for client review.',
      application: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit deliverable', error: error.message });
  }
});

// POST /api/applications/:id/review - Submit post-gig rating and review
router.post('/applications/:id/review', authMiddleware, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a valid rating between 1 and 5 stars.' });
    }

    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { opportunity: true },
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const authorName = req.user.name || req.user.email || 'Verified Member';

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: {
        rating: numRating,
        reviewText: String(reviewText || '').trim(),
        reviewAuthor: authorName,
      },
    });

    res.json({
      success: true,
      message: 'Rating and review recorded successfully.',
      application: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record review', error: error.message });
  }
});

// POST /api/applications/:id/approve-payout - Approve deliverable and disburse escrow to freelancer wallet
router.post('/applications/:id/approve-payout', authMiddleware, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { opportunity: true, user: true },
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Must be job poster, employer, admin, or the applicant in demo mode
    const isOwner = application.opportunity.postedById === req.user.id;
    const isEmployerOrAdmin = req.user.role === 'EMPLOYER' || req.user.role === 'ADMIN';
    const isApplicant = application.userId === req.user.id;

    if (!isOwner && !isEmployerOrAdmin && !isApplicant) {
      return res.status(403).json({ success: false, message: 'Unauthorized to approve this milestone payout.' });
    }

    // Extract numeric stipend amount
    const stipendStr = application.opportunity?.stipend || '₹5000';
    const numAmount = parseInt(String(stipendStr).replace(/[^0-9]/g, ''), 10) || 5000;

    // Execute atomic milestone signoff and wallet increment
    const [updatedApp, updatedFreelancer] = await prisma.$transaction([
      prisma.application.update({
        where: { id: application.id },
        data: {
          deliveryStatus: 'APPROVED',
          status: 'ACCEPTED',
        },
      }),
      prisma.user.update({
        where: { id: application.userId },
        data: {
          walletBalance: { increment: numAmount },
          totalEarned: { increment: numAmount },
          earnings: { increment: numAmount },
        },
        select: { id: true, name: true, email: true, walletBalance: true, totalEarned: true },
      }),
      prisma.auditLog.create({
        data: {
          action: 'ESCROW_PAYOUT_RELEASED',
          detail: `Approved deliverable for gig "${application.opportunity.title}". Disbursed ₹${numAmount.toLocaleString()} to ${application.user.email}`,
          type: 'escrow',
        },
      }),
    ]);

    res.json({
      success: true,
      message: `Deliverable approved! ₹${numAmount.toLocaleString()} credited to freelancer wallet.`,
      amount: numAmount,
      application: updatedApp,
      freelancer: updatedFreelancer,
    });
  } catch (error) {
    console.error('[Approve Payout Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to disburse payout', error: error.message });
  }
});

export default router;
