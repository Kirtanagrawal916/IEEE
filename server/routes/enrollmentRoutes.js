import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/tracks/:trackId/enroll
router.post('/tracks/:trackId/enroll', authMiddleware, async (req, res) => {
  try {
    const { trackId } = req.params;

    const track = await prisma.skillTrack.findUnique({ where: { id: trackId } });
    if (!track) {
      return res.status(404).json({ success: false, message: 'Track not found' });
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

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to enroll in track', error: error.message });
  }
});

// GET /api/enrollments
router.get('/enrollments', authMiddleware, async (req, res) => {
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

    res.json({ success: true, enrollments: formattedEnrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch enrollments', error: error.message });
  }
});

// POST /api/lessons/:lessonId/complete
router.post('/lessons/:lessonId/complete', authMiddleware, async (req, res) => {
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

// GET /api/progress/:trackId
router.get('/progress/:trackId', authMiddleware, async (req, res) => {
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
