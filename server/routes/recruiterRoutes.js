/**
 * Recruiter Routes  ->  server/routes/recruiterRoutes.js
 * Mounted at /api/recruiter. Only EMPLOYER (recruiter) and ADMIN users can call these.
 * Recruiters only ever see and change their own jobs and the applicants for those jobs.
 */
import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only recruiters (EMPLOYER) and admins can use these endpoints
const requireRecruiter = (req, res, next) => {
  const role = String(req.user?.role || '').toUpperCase();
  if (role === 'EMPLOYER' || role === 'ADMIN') return next();
  return res.status(403).json({ success: false, message: 'Recruiter access required.' });
};
router.use(authMiddleware, requireRecruiter);

const parse = (value, fallback = []) => {
  try { return JSON.parse(value); } catch { return fallback; }
};
const asList = (v) =>
  Array.isArray(v) ? v.map((s) => String(s).trim()).filter(Boolean)
    : String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

// Ownership filter: recruiters see only their jobs, admins see everything
const owned = (req) => (req.user.role === 'ADMIN' ? {} : { postedById: req.user.id });

const shapeJob = (j) => ({
  ...j,
  skillsRequired: parse(j.skillsRequired),
  deliverables: parse(j.deliverables),
  applicants: j._count?.applications ?? 0,
  _count: undefined,
});

// GET /api/recruiter/stats
router.get('/stats', async (req, res, next) => {
  try {
    const where = owned(req);
    const [totalJobs, openJobs, byStatus] = await Promise.all([
      prisma.opportunity.count({ where }),
      prisma.opportunity.count({ where: { ...where, isOpen: true } }),
      prisma.application.groupBy({
        by: ['status'],
        where: { opportunity: where },
        _count: { _all: true },
      }),
    ]);
    const counts = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all]));
    const totalApplicants = byStatus.reduce((sum, s) => sum + s._count._all, 0);
    res.json({
      success: true,
      stats: {
        totalJobs,
        openJobs,
        totalApplicants,
        shortlisted: counts.SHORTLISTED || 0,
        accepted: counts.ACCEPTED || 0,
      },
    });
  } catch (err) { next(err); }
});

// GET /api/recruiter/jobs
router.get('/jobs', async (req, res, next) => {
  try {
    const jobs = await prisma.opportunity.findMany({
      where: owned(req),
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    });
    res.json({ success: true, jobs: jobs.map(shapeJob) });
  } catch (err) { next(err); }
});

// POST /api/recruiter/jobs
router.post('/jobs', async (req, res, next) => {
  try {
    const b = req.body || {};
    const title = String(b.title || '').trim();
    const company = String(b.company || '').trim();
    const stipend = String(b.stipend || '').trim();
    const deadline = new Date(b.deadline);

    if (!title || !company || !stipend || !b.description) {
      return res.status(400).json({ success: false, message: 'Title, company, stipend and description are required.' });
    }
    if (Number.isNaN(deadline.getTime())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid deadline date.' });
    }

    const job = await prisma.opportunity.create({
      data: {
        postedById: req.user.id,
        title,
        company,
        stipend,
        type: b.type || 'Micro-Gig',
        category: b.category || 'Business',
        duration: b.duration || 'Flexible',
        description: String(b.description).trim(),
        skillsRequired: JSON.stringify(asList(b.skillsRequired)),
        deliverables: JSON.stringify(asList(b.deliverables)),
        deadline,
      },
    });
    res.status(201).json({ success: true, job: shapeJob(job) });
  } catch (err) { next(err); }
});

// PATCH /api/recruiter/jobs/:id  (edit fields, or open/close a job)
router.patch('/jobs/:id', async (req, res, next) => {
  try {
    const existing = await prisma.opportunity.findFirst({ where: { id: req.params.id, ...owned(req) } });
    if (!existing) return res.status(404).json({ success: false, message: 'Job not found.' });

    const b = req.body || {};
    const data = {};
    for (const key of ['title', 'company', 'stipend', 'type', 'category', 'duration', 'description']) {
      if (typeof b[key] === 'string' && b[key].trim()) data[key] = b[key].trim();
    }
    if (typeof b.isOpen === 'boolean') data.isOpen = b.isOpen;
    if (b.deadline) {
      const d = new Date(b.deadline);
      if (!Number.isNaN(d.getTime())) data.deadline = d;
    }
    if (b.skillsRequired !== undefined) data.skillsRequired = JSON.stringify(asList(b.skillsRequired));
    if (b.deliverables !== undefined) data.deliverables = JSON.stringify(asList(b.deliverables));

    const job = await prisma.opportunity.update({
      where: { id: existing.id },
      data,
      include: { _count: { select: { applications: true } } },
    });
    res.json({ success: true, job: shapeJob(job) });
  } catch (err) { next(err); }
});

// DELETE /api/recruiter/jobs/:id
router.delete('/jobs/:id', async (req, res, next) => {
  try {
    const existing = await prisma.opportunity.findFirst({ where: { id: req.params.id, ...owned(req) } });
    if (!existing) return res.status(404).json({ success: false, message: 'Job not found.' });
    await prisma.opportunity.delete({ where: { id: existing.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// GET /api/recruiter/applicants?status=SHORTLISTED
router.get('/applicants', async (req, res, next) => {
  try {
    const where = { opportunity: owned(req) };
    if (req.query.status) where.status = String(req.query.status);

    const rows = await prisma.application.findMany({
      where,
      orderBy: { appliedAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, location: true, skills: true } },
        opportunity: { select: { id: true, title: true } },
      },
    });
    res.json({
      success: true,
      applicants: rows.map((a) => ({ ...a, user: { ...a.user, skills: parse(a.user.skills) } })),
    });
  } catch (err) { next(err); }
});

// PATCH /api/recruiter/applicants/:id/status
const ALLOWED = ['UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'];
router.patch('/applicants/:id/status', async (req, res, next) => {
  try {
    const status = String(req.body?.status || '').toUpperCase();
    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${ALLOWED.join(', ')}` });
    }
    const app = await prisma.application.findFirst({
      where: { id: req.params.id, opportunity: owned(req) },
    });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });

    const updated = await prisma.application.update({ where: { id: app.id }, data: { status } });
    res.json({ success: true, application: updated });
  } catch (err) { next(err); }
});

export default router;