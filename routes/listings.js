// ============================================================================
// Listings Routes
// ============================================================================
// Handles all routes related to skill listings including:
// - Browsing all listings (with optional category filtering)
// - Viewing individual listing details
// - Creating new listings
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../database');

// ============================================================================
// GET /listings - Browse all listings with optional category filter
// ============================================================================
// Query parameters:
//   - category: (optional) filter listings by category ID
// Returns: Array of listings with user and category information
// ============================================================================
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT
        l.*,
        u.name as user_name,
        u.rating as user_rating,
        c.name as category_name
      FROM listings l
      JOIN users u ON l.user_id = u.id
      JOIN categories c ON l.category_id = c.id
      WHERE l.status = 'active'
    `;

    const params = [];

    // Apply category filter if provided
    if (category) {
      query += ' AND l.category_id = ?';
      params.push(category);
    }

    query += ' ORDER BY l.created_at DESC';

    const [listings] = await db.query(query, params);

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

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// ============================================================================
// GET /listings/:id - View individual listing details
// ============================================================================
// Parameters:
//   - id: listing ID
// Returns: Detailed listing information with user profile and skills
// ============================================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch listing with user and category information
    const [listings] = await db.query(`
      SELECT
        l.*,
        u.name as user_name,
        u.email as user_email,
        u.bio as user_bio,
        u.professional_title,
        u.rating as user_rating,
        u.member_since,
        c.name as category_name
      FROM listings l
      JOIN users u ON l.user_id = u.id
      JOIN categories c ON l.category_id = c.id
      WHERE l.id = ?
    `, [id]);

    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = listings[0];

    // Fetch skills offered and wanted for this listing
    const [skillsOffered] = await db.query(
      'SELECT skill_name FROM listing_skills_offered WHERE listing_id = ?',
      [id]
    );
    const [skillsWanted] = await db.query(
      'SELECT skill_name FROM listing_skills_wanted WHERE listing_id = ?',
      [id]
    );

    listing.skills_offered = skillsOffered.map(s => s.skill_name);
    listing.skills_wanted = skillsWanted.map(s => s.skill_name);

    // Increment view count
    await db.query('UPDATE listings SET views = views + 1 WHERE id = ?', [id]);

    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing details:', error);
    res.status(500).json({ error: 'Failed to fetch listing details' });
  }
});

// ============================================================================
// POST /listings - Create a new skill listing
// ============================================================================
// Body parameters:
//   - user_id: ID of the user creating the listing
//   - category_id: Category ID for the listing
//   - title: Listing title
//   - description: Detailed description
//   - experience_level: Required experience level
//   - time_commitment: Expected time commitment
//   - duration: Collaboration duration
//   - skills_offered: Array of skill names being offered
//   - skills_wanted: Array of skill names being sought
// Returns: Created listing with ID
// ============================================================================
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      category_id,
      title,
      description,
      experience_level,
      time_commitment,
      duration,
      skills_offered,
      skills_wanted
    } = req.body;

    // Validate required fields
    if (!user_id || !category_id || !title || !description) {
      return res.status(400).json({
        error: 'Missing required fields: user_id, category_id, title, description'
      });
    }

    // Insert the listing into the database
    const [result] = await db.query(`
      INSERT INTO listings (
        user_id, category_id, title, description,
        experience_level, time_commitment, duration, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `, [user_id, category_id, title, description, experience_level, time_commitment, duration]);

    const listingId = result.insertId;

    // Insert skills offered (if provided)
    if (skills_offered && Array.isArray(skills_offered) && skills_offered.length > 0) {
      const skillsOfferedValues = skills_offered.map(skill => [listingId, skill]);
      await db.query(
        'INSERT INTO listing_skills_offered (listing_id, skill_name) VALUES ?',
        [skillsOfferedValues]
      );
    }

    // Insert skills wanted (if provided)
    if (skills_wanted && Array.isArray(skills_wanted) && skills_wanted.length > 0) {
      const skillsWantedValues = skills_wanted.map(skill => [listingId, skill]);
      await db.query(
        'INSERT INTO listing_skills_wanted (listing_id, skill_name) VALUES ?',
        [skillsWantedValues]
      );
    }

    res.status(201).json({
      message: 'Listing created successfully',
      listing_id: listingId
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

module.exports = router;
