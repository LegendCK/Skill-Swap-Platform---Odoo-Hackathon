import express from 'express';
import pool from '../db/client.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Home endpoint called - fetching public profiles...');
    
    const result = await pool.query(`
    WITH 
    offered AS (
        SELECT user_id, json_agg(skill_name) AS skills_offered
        FROM (
        SELECT us.user_id, s.skill_name
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.skill_id
        WHERE us.skill_type = 'offered'
        ) sub
        GROUP BY user_id
    ),
    wanted AS (
        SELECT user_id, json_agg(skill_name) AS skills_wanted
        FROM (
        SELECT us.user_id, s.skill_name
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.skill_id
        WHERE us.skill_type = 'wanted'
        ) sub
        GROUP BY user_id
    ),
    ratings AS (
        SELECT to_user_id AS user_id, ROUND(AVG(rating)::numeric, 2) AS rating
        FROM feedback
        GROUP BY to_user_id
    )

    SELECT 
        u.user_id,
        u.name,
        u.location,
        COALESCE(o.skills_offered, '[]') AS skills_offered,
        COALESCE(w.skills_wanted, '[]') AS skills_wanted,
        r.rating
    FROM users u
    LEFT JOIN offered o ON o.user_id = u.user_id
    LEFT JOIN wanted w ON w.user_id = u.user_id
    LEFT JOIN ratings r ON r.user_id = u.user_id
    WHERE u.public_profile = true AND u.profile_completed = true
    ORDER BY r.rating DESC NULLS LAST;
    `);
    
    console.log('Query executed successfully, returning', result.rows.length, 'profiles');
    res.status(200).json({ users: result.rows });
  } catch (err) {
    console.error('Error fetching public profiles:', err);
    console.error('Error message:', err.message);
    res.status(500).json({ error: 'Failed to fetch public profiles: ' + err.message });
  }
});

export default router;
