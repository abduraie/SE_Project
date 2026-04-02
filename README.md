# Skill Exchange Platform - Sprint 3

## Overview

The Skill Exchange Platform is a full-stack web application that enables users to offer their skills and connect with others for mutual learning and collaboration. This Sprint 3 implementation delivers the core database-driven functionality required by the Software Engineering module assessment.

## Project Structure

```
sprint3/
├── backend/              # Backend (Node.js/Express) - Student Responsibility
│   ├── app.js           # Main Express application
│   ├── database.js      # MySQL connection pool configuration
│   └── routes/          # API route handlers
│       ├── listings.js  # Listing CRUD operations
│       ├── users.js     # User profile operations
│       └── categories.js # Category management
│
├── frontend/            # Frontend (PUG Templates) - Student Responsibility
│   └── views/          # Server-side rendered templates
│       ├── layout.pug           # Base layout with navigation
│       ├── index.pug            # Home/landing page
│       ├── listings.pug         # Browse all listings
│       ├── listing-detail.pug   # Individual listing details
│       ├── users.pug            # Browse all users
│       ├── user-profile.pug     # User profile with listings
│       └── create-listing.pug   # Create new listing form
│
├── database/            # Database (MySQL) - Student Responsibility
│   ├── schema.sql      # Database schema definition
│   └── seed.sql        # Sample data for development
│
├── public/             # Static assets
│   └── css/
│       └── style.css   # Application stylesheet
│
├── package.json        # Node.js dependencies
├── docker-compose.yml  # Docker orchestration
├── dockerfile          # Application container definition
└── README.md          # This file
```

## Technology Stack

### Backend
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v4.18) - Web application framework
- **MySQL2** (v3.6) - MySQL database driver with Promise support

### Frontend
- **PUG** (v3.0) - Template engine for server-side rendering
- **CSS3** - Custom responsive styling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **MySQL 8.0** - Relational database

## Features Implemented

### Sprint 3 Requirements ✅

All minimum requirements from the assessment brief have been implemented:

- ✅ **Users List Page** - Browse all registered users with profile information
- ✅ **User Profile Page** - View detailed user profiles with their listings
- ✅ **Listing Page** - Browse all skill listings with category filtering
- ✅ **Detail Page** - View complete listing information
- ✅ **Tags/Categories** - Skill categories for organization and filtering
- ✅ **Database Integration** - Full MySQL integration with proper schema
- ✅ **Docker Environment** - Complete Docker setup for development

### User Stories Implemented

**US1 - View Listings**: Browse available skill listings from database
**US2 - Filter Listings**: Filter listings by category
**US3 - View User Profile**: View user profiles with credibility indicators
**US4 - View Users List**: Browse all users to discover collaborators
**US5 - Create Listing**: Create new skill exchange listings

## Database Schema

### Core Tables

**users** - Stores user profiles and statistics
- id, name, email, bio, professional_title, location, rating, etc.

**categories** - Skill categorization
- id, name, description

**listings** - Skill exchange opportunities
- id, user_id, category_id, title, description, status, etc.

**listing_skills_offered** - Skills being offered in a listing
- id, listing_id, skill_name

**listing_skills_wanted** - Skills being sought in a listing
- id, listing_id, skill_name

## Installation & Setup

### Prerequisites

- Docker Desktop installed and running
- Git (for version control)
- Modern web browser

### Option 1: Docker Setup (Recommended)

1. **Navigate to the project folder:**
   ```bash
   cd "sprint 3"
   ```

2. **Build and start the containers:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Open browser to `http://localhost:3000`
   - Database automatically initialized with sample data

4. **Stop the containers:**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Set up MySQL database:**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE se_project;"

   # Run schema
   mysql -u root -p se_project < database/schema.sql

   # Load sample data
   mysql -u root -p se_project < database/seed.sql
   ```

3. **Configure environment variables:**
   Create a `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=se_project
   PORT=3000
   ```

4. **Start the application:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## API Endpoints

### Listings
- `GET /api/listings` - Get all listings (optional `?category=id` filter)
- `GET /api/listings/:id` - Get listing details
- `POST /api/listings` - Create new listing

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile with listings

### Categories
- `GET /api/categories` - Get all categories

## Testing the Application

### Testing Skill Creation (Bug Fix)

The main issue identified was that new skills were not being created. This has been fixed in the implementation:

1. Navigate to `http://localhost:3000/create-listing`
2. Fill out the form with:
   - Select a user
   - Choose a category
   - Enter a title
   - Add a description
   - Add skills offered (comma-separated)
   - Add skills wanted (comma-separated)
3. Click "Create Listing"
4. You should be redirected to the new listing's detail page
5. The listing should appear in the listings page

### Testing Database Integration

1. **Browse listings**: `http://localhost:3000/listings`
2. **Filter by category**: Use the dropdown filter
3. **View listing details**: Click on any listing card
4. **Browse users**: `http://localhost:3000/users`
5. **View user profile**: Click on any user card

## Student Responsibilities

### Frontend Student
- All files in `frontend/views/`
- Styling in `public/css/style.css`
- Client-side form validation improvements (future sprint)

### Backend Student
- All files in `backend/`
- Route handlers and controllers
- Database connection management
- API endpoint implementation

### Database Student
- Database schema design (`database/schema.sql`)
- Sample data creation (`database/seed.sql`)
- Query optimization and indexing
- Data validation constraints

## Key Implementation Details

### Academic Code Quality

All code includes:
- Clear, meaningful comments explaining functionality
- Proper error handling
- Input validation
- SQL injection protection via parameterized queries
- RESTful API design patterns
- Separation of concerns (MVC-inspired architecture)

### Bug Fixes Applied

**Issue**: New skill listings were not being created/saved

**Root Cause**: The original scaffold only had a basic Express app with no database integration, routes, or controllers.

**Fix**:
1. Created complete database schema with proper foreign key relationships
2. Implemented listing creation route with transaction safety
3. Added proper validation for required fields
4. Implemented skills_offered and skills_wanted insertion logic
5. Added proper error handling and user feedback

### Security Considerations

- Parameterized SQL queries prevent SQL injection
- Input validation on all form submissions
- Environment variables for sensitive configuration
- CORS and security headers (can be enhanced in Sprint 4)

## Troubleshooting

### Database Connection Issues

```bash
# Check if MySQL container is running
docker ps

# View logs
docker-compose logs db

# Restart database service
docker-compose restart db
```

### Port Already in Use

```bash
# Stop conflicting services
docker-compose down

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Cannot Create Listing

1. Verify database is populated with users and categories
2. Check browser console for JavaScript errors
3. Check application logs: `docker-compose logs app`

## Future Enhancements (Sprint 4)

- User authentication and authorization
- In-app messaging system
- Matching algorithm for skill pairing
- User ratings and reviews
- Advanced search and filtering
- Profile editing functionality
- Email notifications
- External API integrations

## Assessment Compliance

This implementation fulfills all Sprint 3 requirements:

✅ MySQL database with proper schema
✅ Express.js backend with routing
✅ PUG templating for all required pages
✅ Docker containerization
✅ Users list page with database integration
✅ User profile page displaying listings
✅ Listings page with category filtering
✅ Listing detail page
✅ Category/tag system
✅ Create listing functionality
✅ Academic-quality code comments
✅ Team-based file organization

## Contributors

- Eldar Abduraimov
- Justice Nnabueze
- Pradeep Tamang

## License

This project is created for educational purposes as part of the Software Engineering module (CMP-N204-0) at the University of Roehampton London.

---

**Sprint 3 Completion Date**: April 2026
**Module**: Software Engineering (CMP-N204-0)
**Institution**: University of Roehampton London
