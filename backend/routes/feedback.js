import express from 'express';
import pool from '../db/client.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const fromUserId = req.user.user_id;
  const { swap_id, to_user_id, rating, comment } = req.body;

  if (!swap_id || !to_user_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid data provided.' });
  }

  try {
    // Check if swap exists and user is part of it
    const swap = await pool.query(
      `SELECT creator_id, receiver_id, status FROM swap_requests WHERE swap_id = $1`,
      [swap_id]
    );

    if (swap.rows.length === 0) {
      return res.status(404).json({ error: 'Swap not found.' });
    }

    const { creator_id, receiver_id, status } = swap.rows[0];

    if (status !== 'accepted') {
      return res.status(400).json({ error: 'Swap must be accepted to leave feedback.' });
    }

    if (![creator_id, receiver_id].includes(fromUserId)) {
      return res.status(403).json({ error: 'You are not a participant of this swap.' });
    }

    if (![creator_id, receiver_id].includes(to_user_id)) {
      return res.status(400).json({ error: 'Invalid recipient for feedback.' });
    }

    if (to_user_id === fromUserId) {
      return res.status(400).json({ error: 'Cannot give feedback to yourself.' });
    }

    // Prevent duplicate feedback
    const alreadyGiven = await pool.query(
      `SELECT * FROM feedback WHERE swap_id = $1 AND from_user_id = $2 AND to_user_id = $3`,
      [swap_id, fromUserId, to_user_id]
    );

    if (alreadyGiven.rows.length > 0) {
      return res.status(409).json({ error: 'Feedback already submitted.' });
    }

    // Insert feedback
    await pool.query(
      `INSERT INTO feedback (swap_id, from_user_id, to_user_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [swap_id, fromUserId, to_user_id, rating, comment]
    );

    res.status(201).json({ message: 'Feedback submitted successfully.' });

  } catch (err) {
    console.error('Feedback Error:', err.message);
    res.status(500).json({ error: 'Server error while submitting feedback.' });
  }
});

export default router;
