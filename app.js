// ============================================================================
// Skill Exchange Platform - Main Application
// Sprint 3 Implementation
// ============================================================================
// This is the main Express application file that configures middleware,
// routes, and starts the HTTP server. It serves both API endpoints and
// server-side rendered PUG templates.
// ============================================================================

const express = require('express');
const path = require('path');
const app = express();

// ============================================================================
// Middleware Configuration
// ============================================================================

// Parse JSON request bodies for API endpoints
app.use(express.json());

// Parse URL-encoded form data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, client-side JavaScript)
app.use(express.static(path.join(__dirname, '../public')));

// Configure PUG as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../frontend/views'));

// ============================================================================
// API Routes
// ============================================================================
// RESTful API endpoints for frontend consumption
// ============================================================================

const listingsRouter = require('./routes/listings');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');

app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);

// ============================================================================
// Server-Side Rendered Routes (PUG Templates)
// ============================================================================
// These routes render HTML pages using PUG templates
// ============================================================================

const db = require('./database');

// Home page
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Skill Exchange Platform - Home'
  });
});

// Listings page with optional category filter
app.get('/listings', async (req, res) => {
  try {
    const { category } = req.query;

    // Fetch all categories for the filter dropdown
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');

    // Build listings query with optional category filter
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
      listing.skills_offered = skillsOffered.map(s => s.skill_name);
    }

    res.render('listings', {
      title: 'Browse Skill Listings',
      listings,
      categories,
      selectedCategory: category || ''
    });
  } catch (error) {
    console.error('Error rendering listings page:', error);
    res.status(500).send('Error loading listings');
  }
});

// Individual listing detail page
app.get('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [listings] = await db.query(`
      SELECT
        l.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.rating as user_rating,
        u.member_since,
        c.name as category_name
      FROM listings l
      JOIN users u ON l.user_id = u.id
      JOIN categories c ON l.category_id = c.id
      WHERE l.id = ?
    `, [id]);

    if (listings.length === 0) {
      return res.status(404).send('Listing not found');
    }

    const listing = listings[0];

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

    res.render('listing-detail', {
      title: listing.title,
      listing
    });
  } catch (error) {
    console.error('Error rendering listing detail:', error);
    res.status(500).send('Error loading listing details');
  }
});

// Users list page
app.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        id, name, bio, professional_title, location,
        rating, member_since, active_count, success_rate
      FROM users
      ORDER BY member_since DESC
    `);

    res.render('users', {
      title: 'Discover Collaborators',
      users
    });
  } catch (error) {
    console.error('Error rendering users page:', error);
    res.status(500).send('Error loading users');
  }
});

// Individual user profile page
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(`
      SELECT *
      FROM users
      WHERE id = ?
    `, [id]);

    if (users.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = users[0];

    // Fetch user's listings
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

    res.render('user-profile', {
      title: `${user.name} - Profile`,
      user,
      listings
    });
  } catch (error) {
    console.error('Error rendering user profile:', error);
    res.status(500).send('Error loading user profile');
  }
});

// Create listing page (form)
app.get('/create-listing', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
    const [users] = await db.query('SELECT id, name FROM users ORDER BY name');

    res.render('create-listing', {
      title: 'Create New Listing',
      categories,
      users
    });
  } catch (error) {
    console.error('Error rendering create listing page:', error);
    res.status(500).send('Error loading create listing page');
  }
});

// Handle listing creation form submission
app.post('/create-listing', async (req, res) => {
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

    // Insert listing
    const [result] = await db.query(`
      INSERT INTO listings (
        user_id, category_id, title, description,
        experience_level, time_commitment, duration, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `, [user_id, category_id, title, description, experience_level, time_commitment, duration]);

    const listingId = result.insertId;

    // Insert skills offered
    if (skills_offered) {
      const skillsArray = skills_offered.split(',').map(s => s.trim()).filter(s => s);
      if (skillsArray.length > 0) {
        const values = skillsArray.map(skill => [listingId, skill]);
        await db.query(
          'INSERT INTO listing_skills_offered (listing_id, skill_name) VALUES ?',
          [values]
        );
      }
    }

    // Insert skills wanted
    if (skills_wanted) {
      const skillsArray = skills_wanted.split(',').map(s => s.trim()).filter(s => s);
      if (skillsArray.length > 0) {
        const values = skillsArray.map(skill => [listingId, skill]);
        await db.query(
          'INSERT INTO listing_skills_wanted (listing_id, skill_name) VALUES ?',
          [values]
        );
      }
    }

    // Redirect to the newly created listing
    res.redirect(`/listings/${listingId}`);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).send('Error creating listing');
  }
});

// ============================================================================
// Health Check Endpoint
// ============================================================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// 404 Handler
// ============================================================================
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// ============================================================================
// Start Server
// ============================================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✓ Skill Exchange Platform running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Database: ${process.env.DB_NAME || 'se_project'}`);
});

module.exports = app;
