// ============================================================================
// Categories Routes
// ============================================================================
// Handles routes related to skill categories
// Used for filtering listings and displaying category information
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../database');

// ============================================================================
// GET /categories - Get all categories
// ============================================================================
// Returns: Array of all available skill categories
// ============================================================================
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT id, name, description
      FROM categories
      ORDER BY name ASC
    `);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
