/**
 * User Track Enrollments Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/enrollments
 * @desc    Get all enrolled tracks for authenticated user with calculated progress
 * @access  Protected
 */
router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        track: {
          include: { lessons: { select: { id: true } } },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    const userProgress = await prisma.lessonProgress.findMany({
      where: { userId: req.user.id },
      select: { lessonId: true },
    });
    const completedLessonIds = userProgress.map((p) => p.lessonId);

    const formattedEnrollments = enrollments.map((e) => {
      const trackLessonIds = e.track.lessons.map((l) => l.id);
      const completedCount = trackLessonIds.filter((id) => completedLessonIds.includes(id)).length;
      const progressPercent = trackLessonIds.length > 0 ? Math.round((completedCount / trackLessonIds.length) * 100) : 0;

      return {
        ...e,
        completedCount,
        totalLessons: trackLessonIds.length,
        progressPercent,
      };
    });

    res.status(200).json({
      success: true,
      enrollments: formattedEnrollments,
    });
  })
);

/**
 * @route   GET /api/enrollments/:trackId
 * @desc    Get enrollment details for a specific track including lesson progress
 * @access  Protected
 */
router.get(
  '/:trackId',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { trackId } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_trackId: {
          userId: req.user.id,
          trackId,
        },
      },
      include: {
        track: {
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found for this track',
      });
    }

    const userProgress = await prisma.lessonProgress.findMany({
      where: { userId: req.user.id },
      select: { lessonId: true },
    });
    const completedLessonIds = userProgress.map((p) => p.lessonId);

    const completedLessons = enrollment.track.lessons.filter((l) => completedLessonIds.includes(l.id));
    const currentLesson =
      enrollment.track.lessons.find((l) => !completedLessonIds.includes(l.id)) ||
      enrollment.track.lessons[0] ||
      null;

    res.status(200).json({
      success: true,
      enrollment: {
        id: enrollment.id,
        track: {
          ...enrollment.track,
          lessons: enrollment.track.lessons.map((l) => ({
            ...l,
            isCompleted: completedLessonIds.includes(l.id),
          })),
        },
        progressPercent: enrollment.progressPercent,
        completedLessons: completedLessons.map((l) => l.id),
        currentLesson: currentLesson
          ? {
              ...currentLesson,
              isCompleted: completedLessonIds.includes(currentLesson.id),
            }
          : null,
        status: enrollment.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
      },
    });
  })
);

export default router;
