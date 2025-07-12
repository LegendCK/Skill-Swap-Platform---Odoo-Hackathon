import express from 'express';
import pool from '../db/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const SALT_ROUNDS = 10;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  const { email, password, name } = req.body;

  // Validate inputs
  if (
    !email || !password || !name ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof name !== 'string'
  ) {
    return res.status(400).json({ error: 'All fields (email, password, name) must be non-empty strings.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  try {
    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING user_id, email, name`,
      [cleanEmail, hashedPassword, cleanName]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { user_id: newUser.user_id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with success
    res.status(201).json({
      message: 'User registered successfully.',
      user: newUser,
      token: token
    });

  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

export default router;
