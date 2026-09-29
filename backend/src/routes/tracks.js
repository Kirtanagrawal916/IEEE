/**
 * Skill Tracks & Track-Level Lessons Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { verifyToken } from '../utils/jwt.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/tracks
 * @desc    Get all available skill tracks with ordered lessons
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tracks = await prisma.skillTrack.findMany({
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({
      success: true,
      tracks,
    });
  })
);

/**
 * @route   GET /api/tracks/:id
 * @desc    Get skill track details by ID with ordered lessons
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const track = await prisma.skillTrack.findUnique({
      where: { id: req.params.id },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Skill track not found',
      });
    }

    res.status(200).json({
      success: true,
      track,
    });
  })
);

/**
 * @route   GET /api/tracks/:trackId/lessons
 * @desc    Get lessons belonging to a specific track with optional user completion status
 * @access  Public (Optional JWT)
 */
router.get(
  '/:trackId/lessons',
  asyncHandler(async (req, res) => {
    const { trackId } = req.params;

    const lessons = await prisma.lesson.findMany({
      where: { trackId },
      orderBy: { orderIndex: 'asc' },
    });

    let completedLessonIds = [];
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        const userId = decoded.id || decoded.userId;

        if (userId) {
          const userProgress = await prisma.lessonProgress.findMany({
            where: { userId },
            select: { lessonId: true },
          });
          completedLessonIds = userProgress.map((p) => p.lessonId);
        }
      } catch (err) {
        // Ignore invalid token for public listing
      }
    }

    const formattedLessons = lessons.map((lesson) => ({
      ...lesson,
      isCompleted: completedLessonIds.includes(lesson.id),
    }));

    res.status(200).json({
      success: true,
      lessons: formattedLessons,
    });
  })
);

/**
 * @route   POST /api/tracks/:trackId/enroll
 * @desc    Enroll authenticated user into a skill track
 * @access  Protected
 */
router.post(
  '/:trackId/enroll',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { trackId } = req.params;

    const track = await prisma.skillTrack.findUnique({ where: { id: trackId } });
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Skill track not found',
      });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_trackId: {
          userId: req.user.id,
          trackId,
        },
      },
      update: { lastAccessedAt: new Date() },
      create: {
        userId: req.user.id,
        trackId,
        progressPercent: 0.0,
      },
      include: { track: true },
    });

    res.status(200).json({
      success: true,
      enrollment,
    });
  })
);

export default router;
