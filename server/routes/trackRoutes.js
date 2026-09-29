import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

const router = express.Router();

// GET /api/tracks
router.get('/tracks', async (req, res) => {
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
        keyTakeaways: JSON.parse(lesson.keyTakeaways || '[]'),
      })),
    }));

    res.json({ success: true, tracks: formattedTracks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch skill tracks', error: error.message });
  }
});

// GET /api/tracks/:id
router.get('/tracks/:id', async (req, res) => {
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
        keyTakeaways: JSON.parse(lesson.keyTakeaways || '[]'),
      })),
    };

    res.json({ success: true, track: formattedTrack });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch track details', error: error.message });
  }
});

// GET /api/tracks/:trackId/lessons
router.get('/tracks/:trackId/lessons', async (req, res) => {
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
        const secret = process.env.JWT_SECRET || 'her_earn_jwt_secret_key_2026_prototype';
        const decoded = jwt.verify(token, secret);
        const userProgress = await prisma.lessonProgress.findMany({
          where: { userId: decoded.userId },
          select: { lessonId: true },
        });
        completedLessonIds = userProgress.map((p) => p.lessonId);
      } catch (err) {
        // invalid token ignored for public listing
      }
    }

    const formattedLessons = lessons.map((lesson) => ({
      ...lesson,
      keyTakeaways: JSON.parse(lesson.keyTakeaways || '[]'),
      isCompleted: completedLessonIds.includes(lesson.id),
    }));

    res.json({ success: true, lessons: formattedLessons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lessons', error: error.message });
  }
});

// GET /api/lessons/:id
router.get('/lessons/:id', async (req, res) => {
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
        keyTakeaways: JSON.parse(lesson.keyTakeaways || '[]'),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lesson', error: error.message });
  }
});

export default router;
