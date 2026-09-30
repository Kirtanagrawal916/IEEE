import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    user: {
      ...user,
      skills: JSON.parse(user.skills || '[]'),
    },
  });
});

// PATCH /api/users/me
router.patch('/me', authMiddleware, async (req, res) => {
  try {
    const { name, avatar, location, bio, skills } = req.body;

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (avatar !== undefined) updatedData.avatar = avatar;
    if (location !== undefined) updatedData.location = location;
    if (bio !== undefined) updatedData.bio = bio;
    if (skills !== undefined) updatedData.skills = JSON.stringify(skills);

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
        skills: JSON.parse(user.skills || '[]'),
        totalEarned: user.totalEarned,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
});

export default router;
