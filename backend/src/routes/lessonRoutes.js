import express from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/lessons/:id
 * @desc    Fetch details of a single lesson
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { track: true },
    });

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.json({
      success: true,
      lesson: {
        ...lesson,
        keyTakeaways: typeof lesson.keyTakeaways === 'string' ? JSON.parse(lesson.keyTakeaways || '[]') : (lesson.keyTakeaways || []),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lesson', error: error.message });
  }
});

/**
 * @route   POST /api/lessons/:lessonId/complete
 * @desc    Mark a lesson as complete for the authenticated user
 * @access  Private
 */
router.post('/:lessonId/complete', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { track: true },
    });

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Add completion progress record
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

    // Calculate updated progress percentage for the track
    const totalLessons = await prisma.lesson.count({
      where: { trackId: lesson.trackId },
    });

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

    // Update Enrollment
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

    res.json({
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record lesson completion', error: error.message });
  }
});

export default router;
