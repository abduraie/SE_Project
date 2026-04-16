// ============================================================================
// Database Connection Module
// ============================================================================
// This module establishes and manages the MySQL database connection pool
// using environment variables for configuration. It provides a reusable
// connection interface for all database operations across the application.
// ============================================================================

const mysql = require('mysql2');

// Create a connection pool for better performance and resource management
// A pool maintains multiple connections and reuses them efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'se_project',
  waitForConnections: true,
  connectionLimit: 10,           // Maximum number of connections in the pool
  queueLimit: 0                  // Unlimited queued connection requests
});

// Export promise-based interface for async/await usage
// This allows cleaner asynchronous code throughout the application
const promisePool = pool.promise();

module.exports = promisePool;
