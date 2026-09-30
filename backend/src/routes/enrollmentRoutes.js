import express from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/tracks/:trackId/enroll
 * @desc    Enroll authenticated user in a skill track
 * @access  Private
 */
router.post('/tracks/:trackId/enroll', authenticateToken, async (req, res) => {
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

/**
 * @route   GET /api/enrollments
 * @desc    Get all enrollments for authenticated user
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

/**
 * @route   GET /api/enrollments/:trackId
 * @desc    Get single track enrollment details for authenticated user
 * @access  Private
 */
router.get('/:trackId', authenticateToken, async (req, res) => {
  try {
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
      return res.status(404).json({ success: false, message: 'Enrollment not found for this track' });
    }

    const userProgress = await prisma.lessonProgress.findMany({
      where: { userId: req.user.id },
      select: { lessonId: true },
    });

    const completedLessonIds = userProgress.map((p) => p.lessonId);
    const completedLessons = enrollment.track.lessons.filter((l) => completedLessonIds.includes(l.id));
    const currentLesson = enrollment.track.lessons.find((l) => !completedLessonIds.includes(l.id)) || enrollment.track.lessons[0] || null;

    res.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        track: {
          ...enrollment.track,
          lessons: enrollment.track.lessons.map((l) => ({
            ...l,
            keyTakeaways: typeof l.keyTakeaways === 'string' ? JSON.parse(l.keyTakeaways || '[]') : (l.keyTakeaways || []),
            isCompleted: completedLessonIds.includes(l.id),
          })),
        },
        progressPercent: enrollment.progressPercent,
        completedLessons: completedLessons.map((l) => l.id),
        currentLesson: currentLesson ? {
          ...currentLesson,
          keyTakeaways: typeof currentLesson.keyTakeaways === 'string' ? JSON.parse(currentLesson.keyTakeaways || '[]') : (currentLesson.keyTakeaways || []),
          isCompleted: completedLessonIds.includes(currentLesson.id),
        } : null,
        status: enrollment.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch enrollment details', error: error.message });
  }
});

export default router;
