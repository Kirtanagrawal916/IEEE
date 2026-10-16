import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const formatUser = (user) => {
  let parsedSkills = [];
  try {
    parsedSkills = typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (user.skills || []);
  } catch {
    parsedSkills = [];
  }

  let parsedLessons = [];
  try {
    parsedLessons = typeof user.completedLessons === 'string' ? JSON.parse(user.completedLessons || '[]') : (user.completedLessons || []);
  } catch {
    parsedLessons = [];
  }

  let parsedAppliedGigs = [];
  try {
    parsedAppliedGigs = typeof user.appliedGigIds === 'string' ? JSON.parse(user.appliedGigIds || '[]') : (user.appliedGigIds || []);
  } catch {
    parsedAppliedGigs = [];
  }

  let parsedBadges = [];
  try {
    parsedBadges = typeof user.badges === 'string' ? JSON.parse(user.badges || '[]') : (user.badges || []);
  } catch {
    parsedBadges = [];
  }

  const cleanUsername = user.username || (user.email ? user.email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase() : 'learner');

  return {
    id: user.id,
    name: user.name,
    username: cleanUsername,
    email: user.email,
    role: (user.role || 'LEARNER').toUpperCase(),
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanUsername)}`,
    location: user.location || 'India',
    bio: user.bio || '',
    title: user.title || 'Digital Skill Specialist',
    skills: parsedSkills,
    skillPoints: user.skillPoints !== undefined ? user.skillPoints : 150,
    totalEarned: user.totalEarned || 0,
    earnings: user.earnings !== undefined ? user.earnings : (user.totalEarned || 0),
    walletBalance: user.walletBalance !== undefined ? user.walletBalance : (user.totalEarned || 0),
    completedLessons: parsedLessons,
    appliedGigIds: parsedAppliedGigs,
    badges: parsedBadges,
    status: user.status || 'Active',
    verifiedKyc: Boolean(user.verifiedKyc),
    verified: user.verified !== undefined ? Boolean(user.verified) : true,
  };
};

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    user: formatUser(req.user),
  });
});

// PATCH /api/users/me
router.patch('/me', authMiddleware, async (req, res) => {
  try {
    const { 
      name, username, avatar, location, bio, title, skills, 
      skillPoints, earnings, totalEarned, walletBalance, 
      completedLessons, appliedGigIds, badges 
    } = req.body;

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (username !== undefined) {
      const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
      const existing = await prisma.user.findFirst({
        where: {
          username: cleanUsername,
          NOT: { id: req.user.id },
        },
      }).catch(() => null);

      if (existing) {
        return res.status(409).json({ success: false, message: `Username @${cleanUsername} is already taken.` });
      }
      updatedData.username = cleanUsername;
    }
    if (avatar !== undefined) updatedData.avatar = avatar;
    if (location !== undefined) updatedData.location = location;
    if (bio !== undefined) updatedData.bio = bio;
    if (title !== undefined) updatedData.title = title;
    if (skills !== undefined) updatedData.skills = Array.isArray(skills) ? JSON.stringify(skills) : skills;
    if (skillPoints !== undefined) updatedData.skillPoints = Number(skillPoints);
    if (earnings !== undefined) updatedData.earnings = Number(earnings);
    if (totalEarned !== undefined) updatedData.totalEarned = Number(totalEarned);
    if (walletBalance !== undefined) updatedData.walletBalance = Number(walletBalance);
    if (completedLessons !== undefined) updatedData.completedLessons = Array.isArray(completedLessons) ? JSON.stringify(completedLessons) : completedLessons;
    if (appliedGigIds !== undefined) updatedData.appliedGigIds = Array.isArray(appliedGigIds) ? JSON.stringify(appliedGigIds) : appliedGigIds;
    if (badges !== undefined) updatedData.badges = Array.isArray(badges) ? JSON.stringify(badges) : badges;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updatedData,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully in database',
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
});

// GET /api/users/:id (Public profile)
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        avatar: true,
        location: true,
        bio: true,
        skills: true,
        totalEarned: true,
        createdAt: true,
        portfolios: {
          orderBy: { createdAt: 'desc' },
        },
        enrollments: {
          where: { isCompleted: true },
          include: { track: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    res.json({
      success: true,
      user: {
        ...user,
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (user.skills || []),
        portfolios: (user.portfolios || []).map(p => ({
          ...p,
          tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public profile', error: error.message });
  }
});

export default router;

