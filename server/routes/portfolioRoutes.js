import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/portfolio/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const formattedProjects = projects.map((p) => ({
      ...p,
      tags: JSON.parse(p.tags || '[]'),
    }));

    res.json({ success: true, projects: formattedProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user portfolio', error: error.message });
  }
});

// GET /api/portfolio (all verified public projects)
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.portfolioProject.findMany({
      include: {
        user: { select: { id: true, name: true, avatar: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedProjects = projects.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      description: p.description,
      imageUrl: p.imageUrl,
      projectUrl: p.projectUrl,
      tags: JSON.parse(p.tags || '[]'),
      likes: p.likesCount,
      verified: p.verified,
      authorName: p.user.name,
      authorAvatar: p.user.avatar,
      location: p.user.location,
      createdAt: p.createdAt,
    }));

    res.json({ success: true, projects: formattedProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public portfolio feed', error: error.message });
  }
});

// POST /api/portfolio
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, category, description, imageUrl, projectUrl, tags } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Title, category, and description are required' });
    }

    const project = await prisma.portfolioProject.create({
      data: {
        userId: req.user.id,
        title,
        category,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600',
        projectUrl: projectUrl || '',
        tags: JSON.stringify(tags || [category]),
        verified: true, // auto-verified for prototype
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: {
        ...project,
        tags: JSON.parse(project.tags || '[]'),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create portfolio project', error: error.message });
  }
});

// GET /api/portfolio/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.portfolioProject.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, avatar: true, location: true, bio: true } },
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      project: {
        ...project,
        tags: JSON.parse(project.tags || '[]'),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project details', error: error.message });
  }
});

// PATCH /api/portfolio/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await prisma.portfolioProject.findUnique({ where: { id: req.params.id } });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this project' });
    }

    const { title, category, description, imageUrl, projectUrl, tags } = req.body;
    const updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (category !== undefined) updatedData.category = category;
    if (description !== undefined) updatedData.description = description;
    if (imageUrl !== undefined) updatedData.imageUrl = imageUrl;
    if (projectUrl !== undefined) updatedData.projectUrl = projectUrl;
    if (tags !== undefined) updatedData.tags = JSON.stringify(tags);

    const updated = await prisma.portfolioProject.update({
      where: { id: req.params.id },
      data: updatedData,
    });

    res.json({
      success: true,
      project: {
        ...updated,
        tags: JSON.parse(updated.tags || '[]'),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update project', error: error.message });
  }
});

// DELETE /api/portfolio/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await prisma.portfolioProject.findUnique({ where: { id: req.params.id } });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this project' });
    }

    await prisma.portfolioProject.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project', error: error.message });
  }
});

export default router;
