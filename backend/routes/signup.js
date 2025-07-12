import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/client.js';

const router = express.Router();
const SALT_ROUNDS = 10;

// Email regex for basic format check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  const { email, password, name } = req.body;

  // Check for missing fields or wrong types
  if (
    !email || !password || !name ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof name !== 'string'
  ) {
    return res.status(400).json({ error: 'All fields (email, password, name) must be non-empty strings.' });
  }

  // Validate email format
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Enforce minimum password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // Trim and sanitize input
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING user_id, email, name`,
      [cleanEmail, hashedPassword, cleanName]
    );

    const newUser = result.rows[0];
    res.status(201).json({ message: 'User registered successfully.', user: newUser });

  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

export default router;
