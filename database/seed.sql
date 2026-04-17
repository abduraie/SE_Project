-- ============================================================================
-- Skill Exchange Platform - Seed Data
-- Sprint 3 Implementation
-- ============================================================================
-- This file populates the database with sample data for development and
-- testing purposes. It creates realistic users, categories, and listings
-- that demonstrate the platform's functionality.
-- ============================================================================

-- ============================================================================
-- SEED CATEGORIES
-- ============================================================================
-- Insert skill categories based on Sprint 2 wireframes
-- ============================================================================
INSERT INTO categories (name, description) VALUES
('Web Development', 'Frontend and backend web development skills'),
('Mobile Development', 'iOS, Android, and cross-platform mobile apps'),
('Design', 'UI/UX design, graphic design, and visual arts'),
('Data Science', 'Data analysis, machine learning, and statistics'),
('Marketing', 'Digital marketing, SEO, and content strategy'),
('DevOps', 'Cloud infrastructure, CI/CD, and system administration'),
('Programming', 'General programming languages and algorithms');

-- ============================================================================
-- SEED USERS
-- ============================================================================
-- Create sample users with realistic profile information
-- These users will be listed on the "Users" page
-- ============================================================================
INSERT INTO users (name, email, bio, professional_title, location, rating, member_since, response_time, active_count, success_rate) VALUES
('Alex Carter', 'alex.carter@example.com',
 'Second-year Computer Science student with strong backend development skills. Passionate about building scalable web applications and learning new technologies.',
 'Computer Science Student / Junior Backend Developer',
 'London, UK',
 4.8,
 '2024-01-15 10:00:00',
 '< 2 hours',
 5,
 95),

('Maya Thompson', 'maya.thompson@example.com',
 'Marketing professional transitioning into web development. Looking for real collaboration experience and mentorship in coding while offering marketing expertise.',
 'Marketing Assistant transitioning into Web Development',
 'Manchester, UK',
 4.5,
 '2024-02-20 14:30:00',
 '< 4 hours',
 3,
 90),

('James Wilson', 'james.wilson@example.com',
 'Experienced full-stack developer specializing in React and Node.js. Enjoy teaching others and collaborating on interesting projects.',
 'Senior Full-Stack Developer',
 'Bristol, UK',
 4.9,
 '2023-11-10 09:15:00',
 '< 1 hour',
 12,
 98),

('Sarah  Kumar', 'sarah.kumar@example.com',
 'UX/UI designer with 3 years of experience. Looking to improve my front-end development skills through practical collaboration.',
 'UX/UI Designer',
 'Birmingham, UK',
 4.7,
 '2024-01-05 16:45:00',
 '< 3 hours',
 7,
 93),

('David Chen', 'david.chen@example.com',
 'Data science enthusiast and Python developer. Happy to help with data analysis projects in exchange for web development mentorship.',
 'Data Analyst',
 'Edinburgh, UK',
 4.6,
 '2024-03-01 11:20:00',
 '< 2 hours',
 4,
 88);

-- ============================================================================
-- SEED LISTINGS
-- ============================================================================
-- Create sample skill exchange listings
-- Each listing offers skills and seeks skills in return
-- ============================================================================
INSERT INTO listings (user_id, category_id, title, description, status, views, experience_level, time_commitment, duration) VALUES
(1, 1, 'Backend Development Help: Node.js & Express',
 'I can help you build robust backend APIs using Node.js and Express. I have experience with RESTful architecture, database integration (MySQL, MongoDB), authentication, and deployment. Looking to improve my frontend skills in return, particularly React or Vue.js.',
 'active', 127, 'Intermediate', '5-10 hours/week', '3-6 months'),

(2, 5, 'Digital Marketing Strategy & SEO Optimization',
 'Offering expertise in digital marketing, content strategy, and SEO. I can help you develop marketing plans, optimize your online presence, and grow your audience. Seeking collaboration with someone who can teach me HTML, CSS, and JavaScript fundamentals.',
 'active', 89, 'Beginner', '3-5 hours/week', '2-4 months'),

(3, 1, 'Full-Stack Web Development Mentorship',
 'Experienced developer offering comprehensive mentorship in full-stack development including React, Node.js, databases, and deployment. Looking for someone with strong design skills to help improve my UI/UX knowledge.',
 'active', 245, 'Advanced', '5-8 hours/week', '6-12 months'),

(4, 3, 'UI/UX Design & Prototyping in Figma',
 'Professional designer offering help with user interface design, user experience research, and prototyping in Figma. I can guide you through the design thinking process and create beautiful, user-friendly interfaces. Want to learn JavaScript and React.',
 'active', 156, 'Intermediate', '4-6 hours/week', '3-6 months'),

(5, 4, 'Data Analysis with Python & Pandas',
 'Can help with data cleaning, analysis, and visualization using Python, Pandas, and Matplotlib. Experience with statistical analysis and basic machine learning. Looking to learn web development and build data-driven web applications.',
 'active', 98, 'Intermediate', '3-5 hours/week', '2-4 months'),

(1, 7, 'SQL Database Design & Optimization',
 'Help with SQL database design, query optimization, and data modeling. Experienced with MySQL and PostgreSQL. Seeking frontend development collaboration, especially modern CSS and responsive design.',
 'active', 73, 'Intermediate', '2-4 hours/week', '1-3 months'),

(3, 6, 'DevOps & CI/CD Pipeline Setup',
 'Can help set up continuous integration and deployment pipelines using GitHub Actions, Docker, and cloud platforms. Looking to expand knowledge in mobile development (React Native or Flutter).',
 'active', 134, 'Advanced', '4-6 hours/week', '3-6 months'),

(4, 3, 'Graphic Design & Brand Identity',
 'Professional graphic designer offering help with logos, brand identity, and visual design. Proficient in Adobe Creative Suite. Want to learn backend development and API design.',
 'active', 112, 'Advanced', '3-5 hours/week', '2-4 months');

-- ============================================================================
-- SEED LISTING SKILLS OFFERED
-- ============================================================================
-- Define specific skills that each listing offers
-- ============================================================================
INSERT INTO listing_skills_offered (listing_id, skill_name) VALUES
-- Listing 1: Backend Development
(1, 'Node.js'),
(1, 'Express.js'),
(1, 'MySQL'),
(1, 'API Design'),
-- Listing 2: Digital Marketing
(2, 'SEO'),
(2, 'Content Strategy'),
(2, 'Social Media Marketing'),
-- Listing 3: Full-Stack Mentorship
(3, 'React'),
(3, 'Node.js'),
(3, 'PostgreSQL'),
(3, 'AWS'),
-- Listing 4: UI/UX Design
(4, 'Figma'),
(4, 'User Research'),
(4, 'Prototyping'),
(4, 'UI Design'),
-- Listing 5: Data Analysis
(5, 'Python'),
(5, 'Pandas'),
(5, 'Data Visualization'),
(5, 'Statistics'),
-- Listing 6: SQL
(6, 'MySQL'),
(6, 'PostgreSQL'),
(6, 'Database Design'),
-- Listing 7: DevOps
(7, 'Docker'),
(7, 'GitHub Actions'),
(7, 'CI/CD'),
(7, 'AWS'),
-- Listing 8: Graphic Design
(8, 'Illustrator'),
(8, 'Photoshop'),
(8, 'Brand Design'),
(8, 'Logo Design');

-- ============================================================================
-- SEED LISTING SKILLS WANTED
-- ============================================================================
-- Define skills that each listing is seeking in exchange
-- ============================================================================
INSERT INTO listing_skills_wanted (listing_id, skill_name) VALUES
-- Listing 1 wants frontend
(1, 'React'),
(1, 'Vue.js'),
(1, 'CSS'),
-- Listing 2 wants web basics
(2, 'HTML'),
(2, 'CSS'),
(2, 'JavaScript'),
-- Listing 3 wants design
(3, 'UI Design'),
(3, 'UX Research'),
(3, 'Figma'),
-- Listing 4 wants JavaScript/React
(4, 'JavaScript'),
(4, 'React'),
(4, 'Frontend Development'),
-- Listing 5 wants web development
(5, 'Web Development'),
(5, 'React'),
(5, 'Node.js'),
-- Listing 6 wants frontend
(6, 'CSS'),
(6, 'Responsive Design'),
(6, 'Tailwind CSS'),
-- Listing 7 wants mobile
(7, 'React Native'),
(7, 'Flutter'),
(7, 'Mobile Development'),
-- Listing 8 wants backend
(8, 'Backend Development'),
(8, 'API Design'),
(8, 'Node.js');
