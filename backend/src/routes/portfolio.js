/**
 * Portfolio Project Management & Public Showcase Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/portfolio/me
 * @desc    Get all portfolio projects belonging to authenticated user
 * @access  Protected
 */
router.get(
  '/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const projects = await prisma.portfolioProject.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      projects,
    });
  })
);

/**
 * @route   GET /api/portfolio
 * @desc    Get public portfolio feed with author details
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const projects = await prisma.portfolioProject.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
          },
        },
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
      tags: p.tags,
      likes: p.likesCount,
      verified: p.verified,
      authorName: p.user.name,
      authorAvatar: p.user.avatar,
      location: p.user.location,
      createdAt: p.createdAt,
    }));

    res.status(200).json({
      success: true,
      projects: formattedProjects,
    });
  })
);

/**
 * @route   GET /api/portfolio/:id
 * @desc    Get single portfolio project details
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const project = await prisma.portfolioProject.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            bio: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  })
);

/**
 * @route   POST /api/portfolio
 * @desc    Create a new showcase project
 * @access  Protected
 */
router.post(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { title, category, description, imageUrl, projectUrl, tags } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and description are required',
      });
    }

    const projectTags = Array.isArray(tags) ? tags : [category];

    const project = await prisma.portfolioProject.create({
      data: {
        userId: req.user.id,
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600',
        projectUrl: projectUrl || '',
        tags: projectTags,
        verified: true, // Auto-verified for prototype
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  })
);

/**
 * @route   PATCH /api/portfolio/:id
 * @desc    Update project (with strict ownership enforcement)
 * @access  Protected
 */
router.patch(
  '/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const project = await prisma.portfolioProject.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to edit this project',
      });
    }

    const { title, category, description, imageUrl, projectUrl, tags } = req.body;
    const updatedData = {};

    if (title !== undefined) updatedData.title = title.trim();
    if (category !== undefined) updatedData.category = category.trim();
    if (description !== undefined) updatedData.description = description.trim();
    if (imageUrl !== undefined) updatedData.imageUrl = imageUrl;
    if (projectUrl !== undefined) updatedData.projectUrl = projectUrl;
    if (tags !== undefined) {
      updatedData.tags = Array.isArray(tags) ? tags : [category || project.category];
    }

    const updated = await prisma.portfolioProject.update({
      where: { id: req.params.id },
      data: updatedData,
    });

    res.status(200).json({
      success: true,
      project: updated,
    });
  })
);

/**
 * @route   DELETE /api/portfolio/:id
 * @desc    Delete project (with strict ownership enforcement)
 * @access  Protected
 */
router.delete(
  '/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const project = await prisma.portfolioProject.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this project',
      });
    }

    await prisma.portfolioProject.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  })
);

export default router;
