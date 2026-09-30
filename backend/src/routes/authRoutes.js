import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { env } from '../config/env.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const secret = env.JWT_SECRET || 'her_earn_jwt_secret_key_2026_prototype';

// In-Memory OTP Store for email verification
const otpStore = new Map();

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send verification OTP code to email
 * @access  Public
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(cleanEmail, { code: generatedOtp, expiresAt });

    console.log(`[OTP SENT] Email: ${cleanEmail} | OTP Code: ${generatedOtp}`);

    res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
      otp: generatedOtp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP code', error: error.message });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP code and log in / create user
 * @access  Public
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const storedRecord = otpStore.get(cleanEmail);

    if (!storedRecord) {
      return res.status(400).json({ success: false, message: 'No OTP requested for this email.' });
    }

    if (Date.now() > storedRecord.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'OTP code has expired.' });
    }

    if (storedRecord.code !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code.' });
    }

    otpStore.delete(cleanEmail);

    let user = await prisma.user.findUnique({ where: { email: cleanEmail } }).catch(() => null);

    if (!user) {
      const rawName = name || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'HerEarn Learner';
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const passwordHash = await bcrypt.hash('google_verified_auth_account', 10);

      user = await prisma.user.create({
        data: {
          name: formattedName,
          email: cleanEmail,
          passwordHash,
          role: 'LEARNER',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
          location: 'India',
          bio: 'Verified Learner via OTP Authentication',
          skills: JSON.stringify(['Digital Marketing', 'Content Creation']),
        },
      });
    }

    const token = jwt.sign({ userId: user.id, id: user.id, email: user.email }, secret, { expiresIn: '7d' });

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

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, bio, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        passwordHash,
        role: 'LEARNER',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        location: location || '',
        bio: bio || '',
        skills: JSON.stringify(skills || []),
      },
    });

    const token = jwt.sign({ userId: user.id, id: user.id, email: user.email }, secret, { expiresIn: '7d' });

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
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (user.skills || []),
        totalEarned: user.totalEarned || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, id: user.id, email: user.email }, secret, { expiresIn: '7d' });

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
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (user.skills || []),
        totalEarned: user.totalEarned || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
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
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
});

export default router;
