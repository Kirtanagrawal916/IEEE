/**
 * Authentication Routes (Register, Login, Email OTP, Current User)
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import crypto from 'crypto';
import { Router } from 'express';
import prisma from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyGoogleToken } from '../utils/googleAuth.js';

const router = Router();

// In-Memory OTP Store for email verification
const otpStore = new Map();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new learner account
 * @access  Public
 */
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, location, bio, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const passwordHash = await hashPassword(password);
    const userSkills = Array.isArray(skills) ? skills : [];

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: 'LEARNER',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        location: location || '',
        bio: bio || '',
        skills: userSkills,
      },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

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
        skills: user.skills,
        totalEarned: user.totalEarned,
      },
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate existing user and return JWT
 * @access  Public
 */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({
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
        skills: user.skills,
        totalEarned: user.totalEarned,
      },
    });
  })
);

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate with verified Google ID token / account linking
 * @access  Public
 */
router.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required.',
      });
    }

    let googlePayload;
    try {
      googlePayload = await verifyGoogleToken(credential);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.message || 'Google authentication failed.',
      });
    }

    const { email, name, picture } = googlePayload;
    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists with this verified email
    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      // Create new user account with verified Google information
      const rawName = name || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'HerEarn Learner';
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const secureRandomPassword = crypto.randomBytes(32).toString('hex');
      const passwordHash = await hashPassword(secureRandomPassword);

      user = await prisma.user.create({
        data: {
          name: formattedName,
          email: cleanEmail,
          passwordHash,
          role: 'LEARNER',
          avatar: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
          location: 'India',
          bio: 'Verified HerEarn Learner via Google Sign-In',
          skills: ['Digital Marketing', 'Graphic Design'],
        },
      });
    } else if (picture && (!user.avatar || user.avatar.includes('dicebear'))) {
      // If user already exists and has default avatar, update avatar without touching existing profile/skills/data
      try {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatar: picture },
        });
      } catch (err) {
        console.warn('Avatar update notice:', err.message);
      }
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        totalEarned: user.totalEarned || 0,
      },
    });
  })
);

/**
 * @route   POST /api/auth/send-otp
 * @desc    Generate and send 6-digit OTP for email verification
 * @access  Public
 */
router.post(
  '/send-otp',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email address is required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanEmail, { code: generatedOtp, expiresAt });

    console.log(`[Backend OTP] Email: ${cleanEmail} | OTP: ${generatedOtp}`);

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
      otp: generatedOtp, // Returned for effortless prototype testing
    });
  })
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP code and authenticate/create user profile
 * @access  Public
 */
router.post(
  '/verify-otp',
  asyncHandler(async (req, res) => {
    const { email, otp, name } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP code are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const storedRecord = otpStore.get(cleanEmail);

    if (!storedRecord) {
      return res.status(400).json({
        success: false,
        message: 'No OTP requested for this email. Please request a new code.',
      });
    }

    if (Date.now() > storedRecord.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'OTP code has expired. Please request a new code.',
      });
    }

    if (storedRecord.code !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Verification failed.',
      });
    }

    otpStore.delete(cleanEmail);

    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      const rawName = name || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'HerEarn Learner';
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const passwordHash = await hashPassword('google_verified_auth_account');

      user = await prisma.user.create({
        data: {
          name: formattedName,
          email: cleanEmail,
          passwordHash,
          role: 'LEARNER',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
          location: 'India',
          bio: 'Verified Learner via OTP Authentication',
          skills: ['Digital Marketing', 'Content Creation'],
        },
      });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({
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
        skills: user.skills,
        totalEarned: user.totalEarned || 0,
      },
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user session details
 * @access  Protected
 */
router.get(
  '/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        location: req.user.location,
        bio: req.user.bio,
        skills: req.user.skills,
        totalEarned: req.user.totalEarned || 0,
      },
    });
  })
);

export default router;
