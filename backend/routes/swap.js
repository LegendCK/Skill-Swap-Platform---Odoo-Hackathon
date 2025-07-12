// routes/swap.js
import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import pool from '../db/client.js';

const router = express.Router();

// GET skills for initiating a swap
router.get('/data/:receiverId', authenticateToken, async (req, res) => {
  const senderId = req.user.user_id;
  const receiverId = parseInt(req.params.receiverId);

  try {
    // Fetch sender's offered skills
    const senderSkills = await pool.query(
      `SELECT s.skill_id, s.skill_name
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.skill_id
       WHERE us.user_id = $1 AND us.skill_type = 'offered'`,
      [senderId]
    );

    // Fetch receiver's wanted skills
    const receiverSkills = await pool.query(
      `SELECT s.skill_id, s.skill_name
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.skill_id
       WHERE us.user_id = $1 AND us.skill_type = 'wanted'`,
      [receiverId]
    );

    res.status(200).json({
      sender_offered_skills: senderSkills.rows,
      receiver_wanted_skills: receiverSkills.rows,
    });

  } catch (err) {
    console.error('Error fetching swap data:', err.message);
    res.status(500).json({ error: 'Failed to fetch skills for swap.' });
  }
});

// routes/swap.js
router.post('/send', authenticateToken, async (req, res) => {
  const creatorId = req.user.user_id;
  const { receiver_id, offered_skill_id, requested_skill_id, message } = req.body;

  if (!receiver_id || !offered_skill_id || !requested_skill_id) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const receiverCheck = await pool.query(
      `SELECT profile_completed, public_profile FROM users WHERE user_id = $1`,
      [receiver_id]
    );

    const receiver = receiverCheck.rows[0];
    if (!receiver || !receiver.profile_completed || !receiver.public_profile) {
      return res.status(403).json({ error: 'Cannot send request. Receiver profile is not eligible.' });
    }

    // Insert swap request
    await pool.query(
      `INSERT INTO swap_requests 
       (creator_id, receiver_id, offered_skill_id, requested_skill_id, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [creatorId, receiver_id, offered_skill_id, requested_skill_id, message]
    );

    res.status(201).json({ message: 'Swap request sent successfully.' });

  } catch (err) {
    console.error('Error sending swap request:', err.message);
    res.status(500).json({ error: 'Failed to send swap request.' });
  }
});

export default router;