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

export default router;
