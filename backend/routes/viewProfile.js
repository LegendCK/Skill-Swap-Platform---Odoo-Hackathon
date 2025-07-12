import express from 'express';
import pool from '../db/client.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// GET /profile/:userId
router.get('/:userId', authenticateToken, async (req, res) => {
  const viewerId = req.user.user_id;
  const { userId } = req.params;

  // Prevent user from viewing their own public profile here (optional)
  if (parseInt(userId) === viewerId) {
    return res.status(400).json({ error: 'Use your own profile route for personal profile.' });
  }

  try {
    // Ensure the profile is public and completed
    const userRes = await pool.query(
      `SELECT name, location, availability FROM users 
       WHERE user_id = $1 AND public_profile = true AND profile_completed = true`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found or not public.' });
    }

    const user = userRes.rows[0];

    // Skills offered
    const offeredRes = await pool.query(
      `SELECT s.skill_id, s.skill_name
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.skill_id
       WHERE us.user_id = $1 AND us.skill_type = 'offered'`,
      [userId]
    );

    // Skills wanted
    const wantedRes = await pool.query(
      `SELECT s.skill_id, s.skill_name
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.skill_id
       WHERE us.user_id = $1 AND us.skill_type = 'wanted'`,
      [userId]
    );

    // Feedback list
    const feedbackRes = await pool.query(
      `SELECT f.rating, f.comment, u.name AS from_user
       FROM feedback f
       JOIN users u ON f.from_user_id = u.user_id
       WHERE f.to_user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    // Average rating
    const ratingRes = await pool.query(
      `SELECT ROUND(AVG(rating)::numeric, 2) AS average_rating
       FROM feedback
       WHERE to_user_id = $1`,
      [userId]
    );

    const avgRating = ratingRes.rows[0].average_rating;

    res.status(200).json({
      user_id: userId,
      name: user.name,
      location: user.location,
      availability: user.availability,
      average_rating: avgRating || null,
      skills_offered: offeredRes.rows,
      skills_wanted: wantedRes.rows,
      feedback: feedbackRes.rows
    });

  } catch (err) {
    console.error('Error viewing profile:', err.message);
    res.status(500).json({ error: 'Server error while fetching profile.' });
  }
});

export default router;
