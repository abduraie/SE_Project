// ============================================================================
// Users Routes
// ============================================================================
// Handles all routes related to users including:
// - Browsing all users
// - Viewing individual user profiles with their listings
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../database');

// ============================================================================
// GET /users - Browse all users
// ============================================================================
// Returns: Array of all registered users with their profile information
// ============================================================================
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        id, name, email, bio, professional_title, location,
        rating, member_since, response_time, active_count, success_rate
      FROM users
      ORDER BY member_since DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ============================================================================
// GET /users/:id - View individual user profile
// ============================================================================
// Parameters:
//   - id: user ID
// Returns: User profile with all their active listings
// ============================================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user profile information
    const [users] = await db.query(`
      SELECT
        id, name, email, bio, professional_title, location,
        rating, member_since, response_time, active_count, success_rate
      FROM users
      WHERE id = ?
    `, [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Fetch user's active listings
    const [listings] = await db.query(`
      SELECT
        l.*,
        c.name as category_name
      FROM listings l
      JOIN categories c ON l.category_id = c.id
      WHERE l.user_id = ?
      ORDER BY l.created_at DESC
    `, [id]);

    // Fetch skills for each listing
    for (let listing of listings) {
      const [skillsOffered] = await db.query(
        'SELECT skill_name FROM listing_skills_offered WHERE listing_id = ?',
        [listing.id]
      );
      const [skillsWanted] = await db.query(
        'SELECT skill_name FROM listing_skills_wanted WHERE listing_id = ?',
        [listing.id]
      );

      listing.skills_offered = skillsOffered.map(s => s.skill_name);
      listing.skills_wanted = skillsWanted.map(s => s.skill_name);
    }

    user.listings = listings;

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;
