-- ============================================================================
-- Skill Exchange Platform - Database Schema
-- Sprint 3 Implementation
-- ============================================================================
-- This schema defines the core database structure for the Skill Exchange
-- platform, supporting user profiles, skill listings, categories, and the
-- relationships between these entities.
-- ============================================================================

-- Drop existing tables if they exist (for clean reinstallation)
DROP TABLE IF EXISTS listing_skills_offered;
DROP TABLE IF EXISTS listing_skills_wanted;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Stores registered user information including profile details and metadata
-- Users can create listings and be discovered by others seeking skills
-- ============================================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    professional_title VARCHAR(255),
    location VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time VARCHAR(50),
    active_count INT DEFAULT 0,
    success_rate INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
-- Defines skill categories for organizing and filtering listings
-- Examples: Web Development, Design, Marketing, etc.
-- ============================================================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- LISTINGS TABLE
-- ============================================================================
-- Stores skill exchange listings created by users
-- Each listing represents a skill offering/exchange opportunity
-- Status can be: 'active', 'completed', 'closed'
-- ============================================================================
CREATE TABLE listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    views INT DEFAULT 0,
    experience_level VARCHAR(50),
    time_commitment VARCHAR(100),
    duration VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- ============================================================================
-- LISTING_SKILLS_OFFERED TABLE
-- ============================================================================
-- Many-to-many relationship: stores skills that a listing offers
-- Allows listings to offer multiple skills
-- ============================================================================
CREATE TABLE listing_skills_offered (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- ============================================================================
-- LISTING_SKILLS_WANTED TABLE
-- ============================================================================
-- Many-to-many relationship: stores skills that a listing is seeking
-- Enables skill exchange matching functionality
-- ============================================================================
CREATE TABLE listing_skills_wanted (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES for Performance Optimization
-- ============================================================================
-- These indexes improve query performance for common search patterns
-- ============================================================================
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_users_email ON users(email);
