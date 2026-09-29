/**
 * Lessons & Lesson Progress Completion Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/lessons/:id
 * @desc    Get single lesson details with track metadata
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { track: true },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    res.status(200).json({
      success: true,
      lesson,
    });
  })
);

/**
 * @route   POST /api/lessons/:lessonId/complete
 * @desc    Mark a lesson complete and recalculate track progress percentage
 * @access  Protected
 */
router.post(
  '/:lessonId/complete',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { track: true },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // 1. Upsert LessonProgress record
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId,
        },
      },
      update: { completedAt: new Date() },
      create: {
        userId: req.user.id,
        lessonId,
      },
    });

    // 2. Count total lessons for track
    const totalLessons = await prisma.lesson.count({
      where: { trackId: lesson.trackId },
    });

    // 3. Count completed lessons for user in this track
    const allTrackLessons = await prisma.lesson.findMany({
      where: { trackId: lesson.trackId },
      select: { id: true },
    });
    const trackLessonIds = allTrackLessons.map((l) => l.id);

    const userProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: req.user.id,
        lessonId: { in: trackLessonIds },
      },
    });

    const completedCount = userProgress.length;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 100;
    const isCompleted = progressPercent === 100;

    // 4. Upsert Enrollment progress
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_trackId: {
          userId: req.user.id,
          trackId: lesson.trackId,
        },
      },
      update: {
        progressPercent,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
        lastAccessedAt: new Date(),
      },
      create: {
        userId: req.user.id,
        trackId: lesson.trackId,
        progressPercent,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Lesson marked as complete',
      progress: {
        trackId: lesson.trackId,
        completedLessonId: lessonId,
        completedCount,
        totalLessons,
        progressPercent,
        isCompleted,
      },
      enrollment,
    });
  })
);

export default router;
