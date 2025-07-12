import express from 'express';
import pool from '../db/client.js';

const router = express.Router();

// GET /skills — Return all skills
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT skill_id, skill_name FROM skills ORDER BY skill_name ASC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching skills:', err.message);
    res.status(500).json({ error: 'Failed to load skills.' });
  }
});

export default router;
