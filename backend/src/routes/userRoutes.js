import express from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (user.skills || []),
        totalEarned: user.totalEarned || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
});

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.patch('/me', authenticateToken, async (req, res) => {
  try {
    const { name, avatar, location, bio, skills } = req.body;

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (avatar !== undefined) updatedData.avatar = avatar;
    if (location !== undefined) updatedData.location = location;
    if (bio !== undefined) updatedData.bio = bio;
    if (skills !== undefined) updatedData.skills = typeof skills === 'string' ? skills : JSON.stringify(skills);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updatedData,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (user.skills || []),
        totalEarned: user.totalEarned || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get public profile of a user by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        avatar: true,
        location: true,
        bio: true,
        skills: true,
        totalEarned: true,
        createdAt: true,
        portfolios: {
          orderBy: { createdAt: 'desc' },
        },
        enrollments: {
          where: { isCompleted: true },
          include: { track: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    res.json({
      success: true,
      user: {
        ...user,
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (user.skills || []),
        portfolios: (user.portfolios || []).map((p) => ({
          ...p,
          tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public profile', error: error.message });
  }
});

export default router;
