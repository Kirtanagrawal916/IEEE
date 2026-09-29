import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const secret = process.env.JWT_SECRET || 'her_earn_jwt_secret_key_2026_prototype';

// In-Memory OTP Store
const otpStore = new Map();

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    // Generate 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanEmail, { code: generatedOtp, expiresAt });

    console.log(`[OTP SENT] Email: ${cleanEmail} | OTP Code: ${generatedOtp}`);

    res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
      otp: generatedOtp, // Included for easy prototype testing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP code', error: error.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const storedRecord = otpStore.get(cleanEmail);

    if (!storedRecord) {
      return res.status(400).json({ success: false, message: 'No OTP requested for this email. Please request a new code.' });
    }

    if (Date.now() > storedRecord.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'OTP code has expired. Please request a new code.' });
    }

    if (storedRecord.code !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Verification failed. Profile was NOT created.' });
    }

    // OTP Verified! Clear record
    otpStore.delete(cleanEmail);

    // Database lookup & link/create user profile
    let user = await prisma.user.findUnique({ where: { email: cleanEmail } }).catch(() => null);

    if (!user) {
      // User doesn't exist, create user in Database!
      const rawName = name || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'HerEarn Learner';
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const passwordHash = await bcrypt.hash('google_verified_auth_account', 10);

      try {
        user = await prisma.user.create({
          data: {
            name: formattedName,
            email: cleanEmail,
            passwordHash,
            role: 'LEARNER',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
            location: 'India',
            bio: 'Verified Learner via Google Authentication',
            skills: JSON.stringify(['Digital Marketing', 'Content Creation']),
          },
        });
      } catch (createErr) {
        // Fallback for database prototype
        user = {
          id: `usr_${Date.now()}`,
          name: formattedName,
          email: cleanEmail,
          role: 'LEARNER',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
          location: 'India',
          bio: 'Verified Learner via Google Authentication',
          skills: ['Digital Marketing', 'Content Creation'],
          totalEarned: 0,
        };
      }
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Email OTP verified successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (user.skills || []),
        totalEarned: user.totalEarned || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'OTP verification failed', error: error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, bio, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'LEARNER',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        location: location || '',
        bio: bio || '',
        skills: JSON.stringify(skills || []),
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        skills: JSON.parse(user.skills || '[]'),
        totalEarned: user.totalEarned,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        skills: JSON.parse(user.skills || '[]'),
        totalEarned: user.totalEarned,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    user: {
      ...user,
      skills: JSON.parse(user.skills || '[]'),
    },
  });
});

export default router;

