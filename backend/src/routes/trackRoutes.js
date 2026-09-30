import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { env } from '../config/env.js';

const router = express.Router();

/**
 * @route   GET /api/tracks
 * @desc    Fetch all skill tracks
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const tracks = await prisma.skillTrack.findMany({
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    const formattedTracks = tracks.map((track) => ({
      ...track,
      lessons: track.lessons.map((lesson) => ({
        ...lesson,
        keyTakeaways: typeof lesson.keyTakeaways === 'string' ? JSON.parse(lesson.keyTakeaways || '[]') : (lesson.keyTakeaways || []),
      })),
    }));

    res.json({ success: true, tracks: formattedTracks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch skill tracks', error: error.message });
  }
});

/**
 * @route   GET /api/tracks/:id
 * @desc    Fetch details of a single track
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const track = await prisma.skillTrack.findUnique({
      where: { id: req.params.id },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!track) {
      return res.status(404).json({ success: false, message: 'Skill track not found' });
    }

    const formattedTrack = {
      ...track,
      lessons: track.lessons.map((lesson) => ({
        ...lesson,
        keyTakeaways: typeof lesson.keyTakeaways === 'string' ? JSON.parse(lesson.keyTakeaways || '[]') : (lesson.keyTakeaways || []),
      })),
    };

    res.json({ success: true, track: formattedTrack });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch track details', error: error.message });
  }
});

/**
 * @route   GET /api/tracks/:trackId/lessons
 * @desc    Fetch all lessons for a track with user completion status if authenticated
 * @access  Public
 */
router.get('/:trackId/lessons', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { trackId: req.params.trackId },
      orderBy: { orderIndex: 'asc' },
    });

    let completedLessonIds = [];
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const secret = env.JWT_SECRET || 'her_earn_jwt_secret_key_2026_prototype';
        const decoded = jwt.verify(token, secret);
        const userId = decoded.userId || decoded.id;
        if (userId) {
          const userProgress = await prisma.lessonProgress.findMany({
            where: { userId },
            select: { lessonId: true },
          });
          completedLessonIds = userProgress.map((p) => p.lessonId);
        }
      } catch (err) {
        // invalid token ignored for public request
      }
    }

    const formattedLessons = lessons.map((lesson) => ({
      ...lesson,
      keyTakeaways: typeof lesson.keyTakeaways === 'string' ? JSON.parse(lesson.keyTakeaways || '[]') : (lesson.keyTakeaways || []),
      isCompleted: completedLessonIds.includes(lesson.id),
    }));

    res.json({ success: true, lessons: formattedLessons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lessons', error: error.message });
  }
});

export default router;
