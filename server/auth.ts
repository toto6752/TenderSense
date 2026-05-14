import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import db from './db.ts';
import { sendEmail } from './email.ts';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
let googleClient: OAuth2Client | null = null;
const getGoogleClient = () => {
  if (!googleClient) {
    googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return googleClient;
};

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Helper for generating tokens
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// 1. Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = crypto.randomUUID();
    const verificationToken = crypto.randomBytes(32).toString('hex');

    db.prepare(`
      INSERT INTO users (id, email, hashed_password, verification_token, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, email, hashedPassword, verificationToken, Date.now());

    const verifyUrl = `${process.env.VITE_APP_URL || 'http://localhost:3000'}/verify/${verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Verify your TenderSense account',
      html: `
        <h1>Welcome to TenderSense</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `
    });

    res.status(201).json({ message: 'Registration successful. Please check your email for verification.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Email Verification
router.get('/verify/:token', (req, res) => {
  const { token } = req.params;
  const user = db.prepare('SELECT id FROM users WHERE verification_token = ?').get(token) as any;

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired verification token' });
  }

  db.prepare('UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?').run(user.id);
  res.json({ message: 'Email verified successfully. You can now log in.' });
});

// 3. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !user.hashed_password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.hashed_password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    const token = generateToken(user.id);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.json({ user: { email: user.email, id: user.id } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Google Auth
router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await getGoogleClient().verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error('Invalid Google token');

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(payload.email) as any;

    if (!user) {
      const userId = crypto.randomUUID();
      db.prepare(`
        INSERT INTO users (id, email, google_id, is_verified, created_at)
        VALUES (?, ?, ?, 1, ?)
      `).run(userId, payload.email, payload.sub, Date.now());
      user = { id: userId, email: payload.email };
    } else if (!user.google_id) {
      db.prepare('UPDATE users SET google_id = ?, is_verified = 1 WHERE id = ?').run(payload.sub, user.id);
    }

    const token = generateToken(user.id);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.json({ user: { email: user.email, id: user.id } });
  } catch (err: any) {
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// 5. Password Reset Request
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?').run(resetToken, expiry, user.id);

    const resetUrl = `${process.env.VITE_APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Reset your TenderSense password',
      html: `<p>Click here to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
    });
  }

  res.json({ message: 'If an account exists, a reset link has been sent.' });
});

// 6. Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const user = db.prepare('SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > ?').get(token, Date.now()) as any;

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  db.prepare('UPDATE users SET hashed_password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?').run(hashedPassword, user.id);

  res.json({ message: 'Password reset successful' });
});

// 7. Get Current Session
router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No session' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.prepare('SELECT id, email, is_verified, created_at FROM users WHERE id = ?').get(decoded.userId) as any;
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid session' });
  }
});

// 8. Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out' });
});

export default router;
