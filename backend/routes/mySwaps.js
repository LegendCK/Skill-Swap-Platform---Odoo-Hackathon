// routes/mySwaps.js
import express from 'express';
import pool from '../db/client.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Helper to format "x days y hours ago"
function formatTimeAgo(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffHrs / 24);
  const hours = diffHrs % 24;

  if (days > 0 && hours > 0) return `${days} day${days > 1 ? 's' : ''} ${hours} hr${hours > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// GET /myswaps
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;

  try {
    // Sent requests
    const sent = await pool.query(`
      SELECT sr.swap_id, u.name AS receiver_name,
             s1.skill_name AS offered_skill,
             s2.skill_name AS requested_skill,
             sr.status, sr.created_at
      FROM swap_requests sr
      JOIN users u ON sr.receiver_id = u.user_id
      LEFT JOIN skills s1 ON sr.offered_skill_id = s1.skill_id
      LEFT JOIN skills s2 ON sr.requested_skill_id = s2.skill_id
      WHERE sr.creator_id = $1
      ORDER BY sr.created_at DESC
    `, [userId]);

    // Received requests
    const received = await pool.query(`
      SELECT sr.swap_id, u.name AS sender_name,
             s1.skill_name AS offered_skill,
             s2.skill_name AS requested_skill,
             sr.status, sr.created_at
      FROM swap_requests sr
      JOIN users u ON sr.creator_id = u.user_id
      LEFT JOIN skills s1 ON sr.offered_skill_id = s1.skill_id
      LEFT JOIN skills s2 ON sr.requested_skill_id = s2.skill_id
      WHERE sr.receiver_id = $1
      ORDER BY sr.created_at DESC
    `, [userId]);

    const format = (rows, sent = false) =>
      rows.map(r => ({
        swap_id: r.swap_id,
        name: sent ? r.receiver_name : r.sender_name,
        offered_skill: r.offered_skill,
        requested_skill: r.requested_skill,
        status: r.status,
        time_ago: formatTimeAgo(r.created_at)
      }));

    res.json({
      sent_requests: format(sent.rows, true),
      received_requests: format(received.rows, false)
    });

  } catch (err) {
    console.error('Error fetching swaps:', err.message);
    res.status(500).json({ error: 'Failed to load swap requests.' });
  }
});

// PATCH /myswaps/respond
router.patch('/respond', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;
  const { swap_id, action } = req.body;

  if (!swap_id || !['accept', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid swap_id or action.' });
  }

  try {
    // Check if this swap exists and the user is the receiver
    const swap = await pool.query(
      `SELECT receiver_id, status FROM swap_requests WHERE swap_id = $1`,
      [swap_id]
    );

    if (swap.rows.length === 0) {
      return res.status(404).json({ error: 'Swap request not found.' });
    }

    const { receiver_id, status } = swap.rows[0];

    if (receiver_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to respond to this request.' });
    }

    if (status !== 'pending') {
      return res.status(400).json({ error: `Swap is already ${status}.` });
    }

    // Update status
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    await pool.query(
      `UPDATE swap_requests SET status = $1 WHERE swap_id = $2`,
      [newStatus, swap_id]
    );

    res.status(200).json({ message: `Swap request ${newStatus}.` });

  } catch (err) {
    console.error('Error responding to swap:', err.message);
    res.status(500).json({ error: 'Server error while updating swap request.' });
  }
});


export default router;
