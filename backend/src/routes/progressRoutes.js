import express from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/progress
 * @desc    Get all learning progress summaries for authenticated user
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        track: {
          include: { lessons: { select: { id: true } } },
        },
      },
    });

    const userProgress = await prisma.lessonProgress.findMany({
      where: { userId: req.user.id },
      select: { lessonId: true },
    });

    const completedLessonIds = userProgress.map((p) => p.lessonId);

    const progressList = enrollments.map((e) => {
      const trackLessonIds = e.track.lessons.map((l) => l.id);
      const completedCount = trackLessonIds.filter((id) => completedLessonIds.includes(id)).length;
      const progressPercent = trackLessonIds.length > 0 ? Math.round((completedCount / trackLessonIds.length) * 100) : 0;

      return {
        id: e.id,
        trackId: e.trackId,
        title: e.track.title,
        category: e.track.category,
        image: e.track.image,
        completedCount,
        totalLessons: trackLessonIds.length,
        progressPercent,
        isCompleted: e.isCompleted,
      };
    });

    res.json({ success: true, progress: progressList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch progress', error: error.message });
  }
});

/**
 * @route   GET /api/progress/:trackId
 * @desc    Get track progress details for authenticated user
 * @access  Private
 */
router.get('/:trackId', authenticateToken, async (req, res) => {
  try {
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
    const progressPercent = lessonIds.length > 0 ? Math.round((completedLessonIds.length / lessonIds.length) * 100) : 0;

    res.json({
      success: true,
      trackId,
      completedLessonIds,
      completedCount: completedLessonIds.length,
      totalLessons: lessonIds.length,
      progressPercent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch track progress', error: error.message });
  }
});

export default router;
