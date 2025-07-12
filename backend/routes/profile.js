import express from 'express';
import pool from '../db/client.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// GET /profile — fetch full profile
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const userRes = await pool.query(
      `SELECT user_id, name, email, location, availability, public_profile, profile_completed
       FROM users WHERE user_id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userRes.rows[0];

    const skillsOfferedRes = await pool.query(
    `SELECT s.skill_id, s.skill_name
    FROM user_skills u
    JOIN skills s ON u.skill_id = s.skill_id
    WHERE u.user_id = $1 AND u.skill_type = 'offered'`,
    [userId]
    );

    const skillsWantedRes = await pool.query(
    `SELECT s.skill_id, s.skill_name
    FROM user_skills u
    JOIN skills s ON u.skill_id = s.skill_id
    WHERE u.user_id = $1 AND u.skill_type = 'wanted'`,
    [userId]
    );


    const profile = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      location: user.location ?? null,
      availability: user.availability ?? null,
      public_profile: user.public_profile,
      profile_completed: user.profile_completed,
      skills_offered: skillsOfferedRes.rows, 
      skills_wanted: skillsWantedRes.rows
    };

    res.json({ profile });
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /profile — update profile data
router.put('/', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;
  const {
    location,
    availability,
    public_profile,
    skills_offered = [],
    skills_wanted = [],
    new_skills_offered = '',
    new_skills_wanted = ''
  } = req.body;

  try {
    // 🔹 Update basic profile fields
    const userUpdateQuery = `
      UPDATE users SET 
        location = $1,
        availability = $2,
        public_profile = $3
      WHERE user_id = $4
    `;
    await pool.query(userUpdateQuery, [location || null, availability || null, public_profile, userId]);

    // 🔹 Delete old skills
    await pool.query('DELETE FROM user_skills WHERE user_id = $1', [userId]);

    // 🔹 Helper: insert skill if not exists
    const resolveSkillNamesToIds = async (commaString) => {
    if (!commaString || commaString.trim() === '') return [];

    const names = commaString
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    const ids = [];

    for (const name of names) {
        // Check if it already exists (case-insensitive)
        const existing = await pool.query(
        'SELECT skill_id FROM skills WHERE LOWER(skill_name) = LOWER($1)',
        [name]
        );

        if (existing.rows.length > 0) {
        ids.push(existing.rows[0].skill_id);
        } else {
        const insert = await pool.query(
            'INSERT INTO skills (skill_name) VALUES ($1) RETURNING skill_id',
            [name]
        );
        ids.push(insert.rows[0].skill_id);
        }
    }

    return ids;
    };


    // 🔹 Insert new skills and collect skill IDs
    const newOfferedIds = await resolveSkillNamesToIds(new_skills_offered);
    const newWantedIds = await resolveSkillNamesToIds(new_skills_wanted);

    const finalSkillsOffered = [...skills_offered, ...newOfferedIds];
    const finalSkillsWanted = [...skills_wanted, ...newWantedIds];

    // 🔹 Validate provided skill IDs
    const validateSkillIds = async (ids) => {
      if (ids.length === 0) return true;
      const result = await pool.query(
        'SELECT skill_id FROM skills WHERE skill_id = ANY($1)',
        [ids]
      );
      return result.rows.length === ids.length;
    };

    const skillsValid = await validateSkillIds([...finalSkillsOffered, ...finalSkillsWanted]);
    if (!skillsValid) {
      return res.status(400).json({ error: 'One or more skill IDs are invalid.' });
    }

    // 🔹 Insert user_skills
    for (const skillId of finalSkillsOffered) {
      await pool.query(
        'INSERT INTO user_skills (user_id, skill_id, skill_type) VALUES ($1, $2, $3)',
        [userId, skillId, 'offered']
      );
    }

    for (const skillId of finalSkillsWanted) {
      await pool.query(
        'INSERT INTO user_skills (user_id, skill_id, skill_type) VALUES ($1, $2, $3)',
        [userId, skillId, 'wanted']
      );
    }

    // 🔹 Mark profile as completed if all required fields exist
    const isComplete = (
      location?.trim() &&
      availability?.trim() &&
      finalSkillsOffered.length > 0 &&
      finalSkillsWanted.length > 0
    );

    await pool.query(
      'UPDATE users SET profile_completed = $1 WHERE user_id = $2',
      [!!isComplete, userId]
    );

    res.status(200).json({
      message: 'Profile updated successfully.',
      profile_completed: !!isComplete
    });

  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ error: 'Server error while updating profile.' });
  }
});



export default router;
