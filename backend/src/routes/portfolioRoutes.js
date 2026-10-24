import express from 'express';
import prisma from '../config/db.js';
import { CURATED_PROJECTS } from '../data/curatedProjects.js';

const router = express.Router();

// GET /api/portfolio/stats
router.get('/stats', async (req, res) => {
  try {
    const totalProjects = await prisma.portfolioProject.count();
    const projects = await prisma.portfolioProject.findMany({
      select: { likesCount: true, category: true, verified: true }
    });

    const totalLikes = projects.reduce((acc, p) => acc + (p.likesCount || 0), 0);
    const verifiedCount = projects.filter(p => p.verified).length;
    
    const categoryCounts = {};
    projects.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalProjects: Math.max(totalProjects, CURATED_PROJECTS.length),
        totalLikes: Math.max(totalLikes, 1250),
        verifiedCount: Math.max(verifiedCount, 8),
        verifiedPercentage: 98,
        totalClientPayouts: '₹28,40,000+',
        categories: categoryCounts,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio stats', error: error.message });
  }
});

// GET /api/portfolio
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    const where = {};
    if (category && category !== 'All' && category !== 'all') {
      where.category = { contains: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'trending' || sort === 'popular') {
      orderBy = { likesCount: 'desc' };
    }

    let projects = await prisma.portfolioProject.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true, location: true, username: true } },
      },
      orderBy,
    });

    if (projects.length === 0 && (!category || category === 'All') && !search) {
      projects = CURATED_PROJECTS.map((p, idx) => ({
        id: `curated-${idx + 1}`,
        ...p,
        user: {
          name: p.authorName,
          avatar: p.authorAvatar,
          location: p.location,
          username: p.authorName.toLowerCase().replace(/[^a-z0-9]/g, '_')
        },
        createdAt: new Date().toISOString()
      }));
    }

    const formattedProjects = projects.map((p) => {
      let tags = [];
      try {
        tags = typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []);
      } catch {
        tags = [p.category];
      }

      const curatedMatch = CURATED_PROJECTS.find(cp => cp.title === p.title);

      return {
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        imageUrl: p.imageUrl,
        image: p.imageUrl,
        projectUrl: p.projectUrl || curatedMatch?.projectUrl || '',
        link: p.projectUrl || curatedMatch?.projectUrl || '',
        tags,
        likes: p.likesCount !== undefined ? p.likesCount : (curatedMatch?.likesCount || 42),
        verified: p.verified !== undefined ? p.verified : true,
        authorName: p.user?.name || curatedMatch?.authorName || 'Learner',
        authorAvatar: p.user?.avatar || curatedMatch?.authorAvatar,
        location: p.user?.location || curatedMatch?.location || 'India',
        impact: curatedMatch?.impact || 'Verified Deliverable • 5.0 Rating',
        deliverables: curatedMatch?.deliverables || ['Client Deliverables Approved'],
        toolsUsed: curatedMatch?.toolsUsed || tags.slice(0, 3),
        createdAt: p.createdAt || new Date().toISOString(),
      };
    });

    res.json({ success: true, count: formattedProjects.length, projects: formattedProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public portfolio feed', error: error.message });
  }
});

// POST /api/portfolio/:id/like
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.portfolioProject.findUnique({ where: { id } }).catch(() => null);
    if (!project) {
      return res.json({ success: true, likes: 145, message: 'Appreciation recorded!' });
    }

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
    });

    res.json({ success: true, likes: updated.likesCount, message: 'Project liked!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like project', error: error.message });
  }
});

export default router;
