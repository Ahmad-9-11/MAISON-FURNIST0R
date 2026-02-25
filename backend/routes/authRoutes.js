import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

// @route   POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    
    // Create verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerifyToken: verifyToken,
      emailVerifyExpires: verifyExpires,
    });

    // Send verification email
    const verifyUrl = `${FRONTEND_URL}/verify-email/${verifyToken}`;
    const html = `
      <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e9e6e3; color: #111;">
        <h1 style="font-weight: 300; font-size: 32px; text-align: center; color: #b87f53;">MAISON FURNISTØR</h1>
        <p style="font-size: 18px; margin-top: 30px;">Welcome to the collection, ${name}.</p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">To complete your registration and access your personal curation, please verify your account by clicking the button below.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verifyUrl}" style="background-color: #b87f53; color: white; padding: 15px 40px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 4px; letter-spacing: 1px; text-transform: uppercase;">Verify Access</a>
        </div>
        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">If the button doesn't work, copy this link: <br/> ${verifyUrl}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">© 2026 Furnistør Maison. All rights reserved.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Maison Account',
        html,
      });
    } catch (err) {
      console.error('Email could not be sent', err);
    }

    const token = signToken(user._id);
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
    res.status(201).json({
      success: true,
      message: 'Registration successful. Verification email sent.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerifyToken: req.params.token,
      emailVerifyExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });
    }
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/auth/me (includes isEmailVerified for polling)
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  res.json({ success: true, user: { ...user, id: user._id } });
});

// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', { maxAge: 0 });
  res.json({ success: true });
});

export default router;
