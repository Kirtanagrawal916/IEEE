import express from 'express';
import { prisma } from '../config/db.js';

const router = express.Router();

// GET /api/opportunities
router.get('/', async (req, res) => {
  try {
    const { category, skill, search, type } = req.query;

    const where = { isOpen: true };

    if (category && category !== 'All Categories') {
      where.category = { contains: category };
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    let formatted = opportunities.map((g) => ({
      ...g,
      skillsRequired: JSON.parse(g.skillsRequired || '[]'),
      deliverables: JSON.parse(g.deliverables || '[]'),
    }));

    if (skill) {
      formatted = formatted.filter((g) =>
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

    res.json({ success: true, count: formatted.length, opportunities: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch opportunities', error: error.message });
  }
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: req.params.id },
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    res.json({
      success: true,
      opportunity: {
        ...opportunity,
        skillsRequired: JSON.parse(opportunity.skillsRequired || '[]'),
        deliverables: JSON.parse(opportunity.deliverables || '[]'),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch opportunity details', error: error.message });
  }
});

// POST /api/opportunities
router.post('/', async (req, res) => {
  try {
    const { title, company, stipend, category, duration, description, skillsRequired, deliverables, logo } = req.body;

    if (!title || !company) {
      return res.status(400).json({ success: false, message: 'Title and company are required' });
    }

    const skills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === 'string'
      ? skillsRequired.split(',').map((s) => s.trim())
      : ['General'];

    const items = Array.isArray(deliverables)
      ? deliverables
      : ['Milestone Deliverable'];

    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        company,
        logo: logo || null,
        stipend: stipend || '₹5,000',
        category: category || 'Digital Marketing',
        duration: duration || '2 Weeks',
        description: description || 'Verified client opportunity on HerEarn platform.',
        skillsRequired: JSON.stringify(skills),
        deliverables: JSON.stringify(items),
        verifiedClient: true,
        isOpen: true,
        status: 'verified',
        applicantsCount: 0,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      opportunity: {
        ...opportunity,
        skillsRequired: skills,
        deliverables: items,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create opportunity', error: error.message });
  }
});

// PATCH /api/opportunities/:id
router.patch('/:id', async (req, res) => {
  try {
    const { verifiedClient, isOpen, status, title, stipend, description } = req.body;
    const data = {};
    if (verifiedClient !== undefined) data.verifiedClient = Boolean(verifiedClient);
    if (isOpen !== undefined) data.isOpen = Boolean(isOpen);
    if (status !== undefined) data.status = status;
    if (title !== undefined) data.title = title;
    if (stipend !== undefined) data.stipend = stipend;
    if (description !== undefined) data.description = description;

    const updated = await prisma.opportunity.update({
      where: { id: req.params.id },
      data,
    });

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      opportunity: {
        ...updated,
        skillsRequired: JSON.parse(updated.skillsRequired || '[]'),
        deliverables: JSON.parse(updated.deliverables || '[]'),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update opportunity', error: error.message });
  }
});

// DELETE /api/opportunities/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.opportunity.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete opportunity', error: error.message });
  }
});

export default router;
