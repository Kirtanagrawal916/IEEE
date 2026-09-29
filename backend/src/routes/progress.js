/**
 * Track Progress Direct Query Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/progress/:trackId
 * @desc    Get detailed progress breakdown for a track
 * @access  Protected
 */
router.get(
  '/:trackId',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { trackId } = req.params;

    const lessons = await prisma.lesson.findMany({
      where: { trackId },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);

    const progressRecords = await prisma.lessonProgress.findMany({
      where: {
        userId: req.user.id,
        lessonId: { in: lessonIds },
      },
    });

    const completedLessonIds = progressRecords.map((p) => p.lessonId);
    const progressPercent =
      lessonIds.length > 0 ? Math.round((completedLessonIds.length / lessonIds.length) * 100) : 0;

    res.status(200).json({
      success: true,
      trackId,
      completedLessonIds,
      completedCount: completedLessonIds.length,
      totalLessons: lessonIds.length,
      progressPercent,
    });
  })
);

export default router;
