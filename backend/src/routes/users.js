/**
 * User Profile Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Protected
 */
router.get(
  '/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        phone: req.user.phone,
        location: req.user.location,
        bio: req.user.bio,
        skills: req.user.skills,
        totalEarned: req.user.totalEarned,
      },
    });
  })
);

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user profile
 * @access  Protected
 */
router.patch(
  '/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { name, avatar, phone, location, bio, skills } = req.body;

    const updatedData = {};
    if (name !== undefined) updatedData.name = name.trim();
    if (avatar !== undefined) updatedData.avatar = avatar;
    if (phone !== undefined) updatedData.phone = phone;
    if (location !== undefined) updatedData.location = location;
    if (bio !== undefined) updatedData.bio = bio;
    if (skills !== undefined) {
      updatedData.skills = Array.isArray(skills) ? skills : [];
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updatedData,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        location: updatedUser.location,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        totalEarned: updatedUser.totalEarned,
      },
    });
  })
);

export default router;
