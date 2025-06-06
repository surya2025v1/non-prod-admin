-- ============================================================================
-- Temple Management System - Website Edit Database Schema
-- File: Edit_Website_Database.sql
-- 
-- Execute this file manually using:
-- mysql -u root -p your_database_name < Edit_Website_Database.sql
-- ============================================================================

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS temple_management;
-- USE temple_management;

-- ============================================================================
-- USERS & AUTHENTICATION TABLES
-- ============================================================================

-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'member') NOT NULL DEFAULT 'member',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- Authentication tokens for Bearer token validation
CREATE TABLE IF NOT EXISTS auth_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    token_type ENUM('access', 'refresh', 'reset_password') NOT NULL DEFAULT 'access',
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token_hash (token_hash),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_active_tokens (token_hash, is_revoked, expires_at)
);

-- ============================================================================
-- WEBSITE METRICS & ANALYTICS TABLES
-- ============================================================================

-- Main website metrics for dashboard overview
CREATE TABLE IF NOT EXISTS website_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    metric_date DATE NOT NULL,
    page_views INT NOT NULL DEFAULT 0,
    unique_visitors INT NOT NULL DEFAULT 0,
    monthly_visitors INT NOT NULL DEFAULT 0,
    average_session_duration INT NOT NULL DEFAULT 0, -- in seconds (4m 32s = 272)
    bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- percentage (32.4%)
    conversion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_date (metric_date),
    INDEX idx_metric_date (metric_date DESC)
);

-- Page-specific analytics for "Top Pages" section
CREATE TABLE IF NOT EXISTS page_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_name VARCHAR(100) NOT NULL, -- Home, Services, Events, Contact
    page_url VARCHAR(255) NOT NULL,
    date_recorded DATE NOT NULL,
    page_views INT NOT NULL DEFAULT 0,
    unique_page_views INT NOT NULL DEFAULT 0,
    time_on_page INT NOT NULL DEFAULT 0, -- in seconds
    bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    exit_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_page_date (page_name, date_recorded),
    INDEX idx_page_name (page_name),
    INDEX idx_date_recorded (date_recorded),
    INDEX idx_page_views (page_views DESC)
);

-- Real-time visitor tracking
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet') NOT NULL DEFAULT 'desktop',
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    referrer_url TEXT,
    landing_page VARCHAR(255),
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    total_pages_visited INT NOT NULL DEFAULT 1,
    session_duration INT NOT NULL DEFAULT 0, -- in seconds
    
    INDEX idx_session_id (session_id),
    INDEX idx_session_start (session_start DESC),
    INDEX idx_device_type (device_type)
);

-- ============================================================================
-- CONTENT MANAGEMENT TABLES
-- ============================================================================

-- Website content sections (Home Screen, Services, Events, Contact Us)
CREATE TABLE IF NOT EXISTS content_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_name VARCHAR(100) NOT NULL UNIQUE, -- home, services, events, contact
    section_title VARCHAR(255) NOT NULL, -- Display name
    section_description TEXT,
    status ENUM('published', 'draft', 'needs_review', 'archived') NOT NULL DEFAULT 'draft',
    priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    page_views INT NOT NULL DEFAULT 0,
    pending_changes INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON SET NULL,
    INDEX idx_section_name (section_name),
    INDEX idx_status (status),
    INDEX idx_last_updated (last_updated DESC)
);

-- Content change history and audit trail
CREATE TABLE IF NOT EXISTS content_changes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_id INT NOT NULL,
    change_type ENUM('create', 'update', 'delete', 'publish', 'unpublish') NOT NULL,
    change_description TEXT,
    old_content JSON,
    new_content JSON,
    changed_by INT NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    
    FOREIGN KEY (section_id) REFERENCES content_sections(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON SET NULL,
    INDEX idx_section_id (section_id),
    INDEX idx_changed_by (changed_by),
    INDEX idx_change_date (change_date DESC)
);

-- ============================================================================
-- TEMPLE SERVICES MANAGEMENT TABLES
-- ============================================================================

-- Temple services for Services Edit page
CREATE TABLE IF NOT EXISTS temple_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(255) NOT NULL,
    category ENUM('regular', 'special', 'festival', 'wellness') NOT NULL DEFAULT 'regular',
    description TEXT,
    schedule_details TEXT,
    duration_minutes INT NOT NULL DEFAULT 60,
    capacity INT NOT NULL DEFAULT 50,
    donation_min DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    donation_max DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    priest_name VARCHAR(255),
    location VARCHAR(255),
    status ENUM('active', 'inactive', 'scheduled') NOT NULL DEFAULT 'active',
    booking_required BOOLEAN NOT NULL DEFAULT FALSE,
    monthly_bookings INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON SET NULL,
    INDEX idx_service_name (service_name),
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- ============================================================================
-- TEMPLE EVENTS MANAGEMENT TABLES
-- ============================================================================

-- Temple events for Events Edit page
CREATE TABLE IF NOT EXISTS temple_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_title VARCHAR(255) NOT NULL,
    event_type ENUM('festival', 'regular', 'workshop', 'special') NOT NULL DEFAULT 'regular',
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    organizer VARCHAR(255),
    expected_attendees INT NOT NULL DEFAULT 0,
    actual_attendees INT NOT NULL DEFAULT 0,
    registration_required BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('upcoming', 'recurring', 'draft', 'planning', 'completed', 'cancelled') NOT NULL DEFAULT 'draft',
    priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON SET NULL,
    INDEX idx_event_date (event_date ASC),
    INDEX idx_event_type (event_type),
    INDEX idx_status (status),
    INDEX idx_upcoming_events (event_date, status)
);

-- ============================================================================
-- CONTACT INFORMATION TABLES
-- ============================================================================

-- Temple contact information for Contact Edit page
CREATE TABLE IF NOT EXISTS temple_contact_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    info_type ENUM('general', 'address', 'contact', 'hours', 'social', 'emergency') NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    key_value TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON SET NULL,
    UNIQUE KEY unique_type_key (info_type, key_name),
    INDEX idx_info_type (info_type),
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
);

-- ============================================================================
-- SYSTEM ACTIVITY & LOGGING TABLES
-- ============================================================================

-- System activity for "Recent Activity" section
CREATE TABLE IF NOT EXISTS system_activity (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_type ENUM('user', 'request', 'donation', 'feedback', 'volunteer', 'content', 'system') NOT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT,
    affected_table VARCHAR(100),
    affected_record_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON SET NULL,
    INDEX idx_activity_type (activity_type),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_recent_activity (created_at DESC, activity_type)
);

-- ============================================================================
-- SAMPLE DATA INSERTION FOR TESTING
-- ============================================================================

-- Insert sample admin users (password: admin123)
INSERT IGNORE INTO users (email, username, full_name, password_hash, role, is_active, is_verified) VALUES
('admin@temple.org', 'admin', 'Temple Administrator', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewruMeKb.GC0XjO2', 'admin', TRUE, TRUE),
('editor@temple.org', 'editor', 'Content Editor', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewruMeKb.GC0XjO2', 'editor', TRUE, TRUE),
('manager@temple.org', 'manager', 'Website Manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewruMeKb.GC0XjO2', 'editor', TRUE, TRUE);

-- Insert sample website metrics (matching the dashboard screenshot)
INSERT IGNORE INTO website_metrics (metric_date, page_views, unique_visitors, monthly_visitors, average_session_duration, bounce_rate) VALUES
(CURDATE(), 24580, 3247, 3247, 272, 32.4),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 21374, 2890, 3100, 245, 35.2),
(DATE_SUB(CURDATE(), INTERVAL 2 DAY), 19823, 2654, 2987, 230, 38.1),
(DATE_SUB(CURDATE(), INTERVAL 3 DAY), 18456, 2234, 2876, 215, 40.5);

-- Insert sample page analytics (matching the Top Pages section)
INSERT IGNORE INTO page_analytics (page_name, page_url, date_recorded, page_views, unique_page_views, time_on_page, bounce_rate) VALUES
('Home', '/', CURDATE(), 8942, 7234, 185, 28.5),
('Services', '/services', CURDATE(), 5678, 4567, 156, 31.2),
('Events', '/events', CURDATE(), 3456, 2890, 201, 25.8),
('Contact', '/contact', CURDATE(), 2504, 2123, 98, 45.2),
('About', '/about', CURDATE(), 1876, 1654, 134, 42.1),
('Gallery', '/gallery', CURDATE(), 1234, 1098, 89, 38.7);

-- Insert content sections (matching the Content Management section)
INSERT IGNORE INTO content_sections (section_name, section_title, section_description, status, page_views, pending_changes, updated_by) VALUES
('home', 'Home Screen', 'Edit homepage content, hero section, and featured elements', 'published', 8942, 3, 1),
('services', 'Services', 'Manage temple services, schedules, and descriptions', 'draft', 5678, 1, 2),
('events', 'Events', 'Update upcoming events, festivals, and special occasions', 'published', 3456, 0, 1),
('contact', 'Contact Us', 'Modify contact information, location, and communication details', 'needs_review', 2504, 2, 2);

-- Insert sample temple services
INSERT IGNORE INTO temple_services (service_name, category, description, schedule_details, duration_minutes, capacity, donation_min, donation_max, priest_name, location, status, monthly_bookings, updated_by) VALUES
('Daily Aarti', 'regular', 'Morning and evening prayer ceremonies with devotional songs', '6:00 AM - 7:00 AM, 7:00 PM - 8:00 PM', 60, 100, 51.00, 501.00, 'Pandit Sharma', 'Main Temple Hall', 'active', 245, 1),
('Wedding Ceremony', 'special', 'Traditional Hindu wedding ceremonies with full rituals', 'By appointment', 240, 200, 5001.00, 25000.00, 'Pandit Gupta', 'Marriage Hall', 'active', 12, 1),
('Satyanarayan Puja', 'festival', 'Monthly puja for Lord Vishnu with prasadam distribution', 'First Saturday of every month', 120, 150, 501.00, 2101.00, 'Pandit Verma', 'Main Temple Hall', 'scheduled', 8, 2),
('Yoga Classes', 'wellness', 'Weekly yoga and meditation sessions for spiritual wellness', 'Tuesday & Thursday 6:00 AM', 90, 30, 201.00, 201.00, 'Yoga Instructor Priya', 'Yoga Hall', 'active', 64, 2);

-- Insert sample temple events
INSERT IGNORE INTO temple_events (event_title, event_type, description, event_date, start_time, end_time, location, organizer, expected_attendees, registration_required, status, priority, updated_by) VALUES
('Diwali Celebration', 'festival', 'Grand Diwali celebration with traditional lighting ceremony, cultural programs, and feast', '2024-11-12', '18:00:00', '22:00:00', 'Main Temple Complex', 'Festival Committee', 500, TRUE, 'upcoming', 'high', 1),
('Weekly Satsang', 'regular', 'Weekly spiritual discourse and devotional singing', '2024-02-15', '19:00:00', '20:30:00', 'Prayer Hall', 'Spiritual Committee', 100, FALSE, 'recurring', 'medium', 2),
('Yoga Workshop', 'workshop', 'Introduction to spiritual yoga and meditation techniques', '2024-02-20', '08:00:00', '12:00:00', 'Yoga Hall', 'Wellness Committee', 30, TRUE, 'draft', 'low', 2),
('Ram Navami Festival', 'festival', 'Celebration of Lord Rama birthday with special prayers and procession', '2024-04-17', '05:00:00', '12:00:00', 'Main Temple', 'Festival Committee', 800, FALSE, 'planning', 'high', 1);

-- Insert sample contact information
INSERT IGNORE INTO temple_contact_info (info_type, key_name, key_value, display_order, updated_by) VALUES
('general', 'temple_name', 'Sacred Hindu Temple', 1, 1),
('general', 'tagline', 'Path to Spiritual Enlightenment', 2, 1),
('general', 'description', 'Welcome to our sacred temple where tradition meets spirituality. We serve our community with devotion and provide a peaceful space for worship, learning, and cultural preservation.', 3, 1),
('address', 'street', '123 Temple Street', 1, 1),
('address', 'city', 'New Delhi', 2, 1),
('address', 'state', 'Delhi', 3, 1),
('address', 'zip_code', '110001', 4, 1),
('address', 'country', 'India', 5, 1),
('contact', 'primary_phone', '+91 98765 43210', 1, 1),
('contact', 'secondary_phone', '+91 98765 43211', 2, 1),
('contact', 'primary_email', 'info@sacredtemple.org', 3, 1),
('contact', 'admin_email', 'admin@sacredtemple.org', 4, 1),
('hours', 'morning_open', '05:00', 1, 1),
('hours', 'morning_close', '12:00', 2, 1),
('hours', 'evening_open', '16:00', 3, 1),
('hours', 'evening_close', '21:00', 4, 1),
('social', 'facebook', 'https://facebook.com/sacredtemple', 1, 1),
('social', 'twitter', 'https://twitter.com/sacredtemple', 2, 1),
('social', 'instagram', 'https://instagram.com/sacredtemple', 3, 1),
('emergency', 'emergency_contact', '+91 98765 99999', 1, 1);

-- Insert sample system activity (matching Recent Activity section)
INSERT IGNORE INTO system_activity (activity_type, action, description, user_id, affected_table, affected_record_id, created_at) VALUES
('user', 'New user registration', 'New member account created', NULL, 'users', 3, DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
('request', 'Service request submitted', 'Request for wedding ceremony submitted', NULL, 'temple_services', 2, DATE_SUB(NOW(), INTERVAL 32 MINUTE)),
('donation', 'Donation received', 'Online donation received', NULL, 'donations', 1, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('feedback', 'Feedback submitted', 'User feedback about temple services', NULL, 'feedback', 1, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('volunteer', 'Volunteer application', 'New volunteer application received', NULL, 'volunteers', 1, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('content', 'Home page updated', 'Updated hero section content and images', 1, 'content_sections', 1, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('content', 'Service added', 'Added new yoga class service', 1, 'temple_services', 4, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
('content', 'Event modified', 'Updated Diwali celebration details', 2, 'temple_events', 1, DATE_SUB(NOW(), INTERVAL 5 HOUR));

-- ============================================================================
-- CREATE PERFORMANCE INDEXES
-- ============================================================================

-- Additional performance indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_website_metrics_latest ON website_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_latest ON page_analytics(date_recorded DESC, page_views DESC);
CREATE INDEX IF NOT EXISTS idx_content_sections_dashboard ON content_sections(status, last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_system_activity_dashboard ON system_activity(created_at DESC, activity_type);
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON temple_events(event_date ASC, status);
CREATE INDEX IF NOT EXISTS idx_services_active ON temple_services(status, category);
CREATE INDEX IF NOT EXISTS idx_contact_active ON temple_contact_info(info_type, is_active, display_order);

-- ============================================================================
-- DATABASE SETUP COMPLETE
-- ============================================================================

-- Display completion message
SELECT 'Database schema created successfully! You can now start the FastAPI server.' as Status; 