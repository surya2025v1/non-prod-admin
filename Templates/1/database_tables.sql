-- =============================================================================
-- TEMPLE MAIN PAGE CONFIGURATION TABLES
-- =============================================================================

-- 1. IMAGE SLIDER CONFIGURATION
-- =============================================================================
CREATE TABLE homepage_slider (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active_order (is_active, display_order),
    INDEX idx_created_at (created_at)
);

-- Backup table for slider
CREATE TABLE homepage_slider_backup (
    backup_id INT PRIMARY KEY AUTO_INCREMENT,
    original_id INT,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    backup_reason VARCHAR(255),
    
    INDEX idx_original_id (original_id),
    INDEX idx_backup_date (backup_date)
);

-- 2. WELCOME SECTION CONFIGURATION
-- =============================================================================
CREATE TABLE homepage_welcome (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_title VARCHAR(255) NOT NULL DEFAULT 'Welcome to Our Sacred Temple',
    sanskrit_verse VARCHAR(500) DEFAULT 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः',
    sanskrit_translation VARCHAR(500) DEFAULT 'May all beings be happy, may all beings be free from illness',
    description TEXT NOT NULL,
    background_image_url VARCHAR(500),
    primary_button_text VARCHAR(100) DEFAULT 'Explore Our Temple',
    primary_button_link VARCHAR(255) DEFAULT '#services',
    secondary_button_text VARCHAR(100) DEFAULT 'Visit Us Today',
    secondary_button_link VARCHAR(255) DEFAULT '/contact',
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active)
);

-- Backup table for welcome section
CREATE TABLE homepage_welcome_backup (
    backup_id INT PRIMARY KEY AUTO_INCREMENT,
    original_id INT,
    section_title VARCHAR(255) NOT NULL,
    sanskrit_verse VARCHAR(500),
    sanskrit_translation VARCHAR(500),
    description TEXT NOT NULL,
    background_image_url VARCHAR(500),
    primary_button_text VARCHAR(100),
    primary_button_link VARCHAR(255),
    secondary_button_text VARCHAR(100),
    secondary_button_link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    backup_reason VARCHAR(255),
    
    INDEX idx_original_id (original_id),
    INDEX idx_backup_date (backup_date)
);

-- 3. SERVICES SECTION CONFIGURATION
-- =============================================================================
CREATE TABLE homepage_services_header (
    id INT PRIMARY KEY AUTO_INCREMENT,
    main_title VARCHAR(255) NOT NULL DEFAULT 'Our Services & Events',
    subtitle TEXT DEFAULT 'Discover the various services, events, and activities our temple offers to the community.',
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE homepage_services_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_title VARCHAR(255) NOT NULL,
    card_subtitle VARCHAR(255),
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    icon_name VARCHAR(100), -- Lucide icon name (Calendar, Users, BookOpen, etc.)
    features JSON, -- Array of features like ["Morning Aarti: 6:00 AM", "Noon Aarti: 12:00 PM"]
    button_text VARCHAR(100) DEFAULT 'Learn More',
    button_link VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active_order (is_active, display_order)
);

-- Backup tables for services
CREATE TABLE homepage_services_header_backup (
    backup_id INT PRIMARY KEY AUTO_INCREMENT,
    original_id INT,
    main_title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    backup_reason VARCHAR(255)
);

CREATE TABLE homepage_services_cards_backup (
    backup_id INT PRIMARY KEY AUTO_INCREMENT,
    original_id INT,
    card_title VARCHAR(255) NOT NULL,
    card_subtitle VARCHAR(255),
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    icon_name VARCHAR(100),
    features JSON,
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    backup_reason VARCHAR(255),
    
    INDEX idx_original_id (original_id),
    INDEX idx_backup_date (backup_date)
);

-- 4. TEMPLE INFORMATION SECTION
-- =============================================================================
CREATE TABLE homepage_temple_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_title VARCHAR(255) NOT NULL DEFAULT 'Visit Our Temple',
    section_subtitle TEXT DEFAULT 'We welcome all devotees to experience the divine peace and spiritual growth at our sacred temple',
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE homepage_info_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_type ENUM('hours', 'contact', 'location', 'other') NOT NULL,
    card_title VARCHAR(255) NOT NULL,
    icon_name VARCHAR(100), -- Lucide icon name
    content JSON NOT NULL, -- Flexible content storage
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type_active (card_type, is_active),
    INDEX idx_active_order (is_active, display_order)
);

-- Backup tables for temple info
CREATE TABLE homepage_temple_info_backup (
    backup_id INT PRIMARY KEY AUTO_INCREMENT,
    original_id INT,
    section_title VARCHAR(255) NOT NULL,
    section_subtitle TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    backup_reason VARCHAR(255)
);

CREATE TABLE homepage_info_cards_backup (
    backup_id INT PRIMARY KEY AUTO_INCREMENT,
    original_id INT,
    card_type ENUM('hours', 'contact', 'location', 'other') NOT NULL,
    card_title VARCHAR(255) NOT NULL,
    icon_name VARCHAR(100),
    content JSON NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    backup_reason VARCHAR(255),
    
    INDEX idx_original_id (original_id),
    INDEX idx_backup_date (backup_date)
);

-- 5. USER MANAGEMENT FOR EDITOR PERMISSIONS
-- =============================================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    permissions JSON, -- Specific permissions like ["homepage_edit", "services_edit", "temple_info_edit"]
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role_active (role, is_active)
);

-- 6. AUDIT LOG FOR TRACKING CHANGES
-- =============================================================================
CREATE TABLE content_audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE', 'BACKUP') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by INT NOT NULL,
    change_reason VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_changed_by (changed_by),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- =============================================================================
-- SAMPLE DATA INSERTION
-- =============================================================================

-- Sample Users
INSERT INTO users (username, email, password_hash, full_name, role, permissions) VALUES 
('admin', 'admin@temple.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj14GaVLV1kW', 'Temple Administrator', 'admin', '["all_permissions"]'),
('editor1', 'editor@temple.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj14GaVLV1kW', 'Content Editor', 'editor', '["homepage_edit", "services_edit", "temple_info_edit"]');

-- Sample Slider Images
INSERT INTO homepage_slider (image_url, alt_text, title, display_order, created_by) VALUES 
('/images/temple-entrance.jpg', 'Temple main entrance', 'Welcome to Our Sacred Temple', 1, 1),
('/images/festival-celebration.jpg', 'Temple celebration', 'Join Our Celebrations', 2, 1),
('/images/temple-interior.jpg', 'Temple interior', 'Sacred Interior', 3, 1),
('/images/cultural-program.jpg', 'Temple festival', 'Cultural Programs', 4, 1);

-- Sample Welcome Section
INSERT INTO homepage_welcome (section_title, description, created_by) VALUES 
('Welcome to Our Sacred Temple', 'Our temple is a sacred space dedicated to spiritual growth, community service, and preserving Hindu traditions. We welcome devotees from all walks of life to join us in prayer and celebration.', 1);

-- Sample Services Header
INSERT INTO homepage_services_header (main_title, subtitle, created_by) VALUES 
('Our Services & Events', 'Discover the various services, events, and activities our temple offers to the community.', 1);

-- Sample Service Cards
INSERT INTO homepage_services_cards (card_title, card_subtitle, description, image_url, icon_name, features, button_text, button_link, display_order, created_by) VALUES 
('Daily Pujas', 'Morning & Evening Ceremonies', 'Join our daily rituals to seek divine blessings and spiritual guidance. Our experienced priests perform traditional ceremonies following ancient Vedic traditions.', '/images/daily-pujas.jpg', 'Calendar', '["Morning Aarti: 6:00 AM", "Noon Aarti: 12:00 PM", "Evening Aarti: 6:30 PM"]', 'View All Ceremonies', '/ceremonies', 1, 1),
('Community Services', 'Serving Our Community', 'We offer various community services focused on education, cultural preservation, and humanitarian aid. Our temple serves as a center for community growth and support.', '/images/community-services.jpg', 'Users', '["Free Food Distribution (Sundays)", "Health Camps (Monthly)", "Youth Mentoring Programs"]', 'Join Our Services', '/services', 2, 1),
('Spiritual Learning', 'Ancient Wisdom & Modern Practice', 'Deepen your spiritual understanding through our comprehensive learning programs, from ancient Sanskrit texts to modern meditation practices.', '/images/spiritual-learning.jpg', 'BookOpen', '["Sanskrit Classes (Weekends)", "Meditation Workshops", "Spiritual Discussion Groups"]', 'Start Learning', '/education', 3, 1);

-- Sample Temple Info Header
INSERT INTO homepage_temple_info (section_title, section_subtitle, created_by) VALUES 
('Visit Our Temple', 'We welcome all devotees to experience the divine peace and spiritual growth at our sacred temple', 1);

-- Sample Info Cards
INSERT INTO homepage_info_cards (card_type, card_title, icon_name, content, display_order, created_by) VALUES 
('hours', 'Temple Hours', 'Calendar', '{"daily": "5:00 AM - 9:00 PM", "special_events": "Extended Hours", "festivals": "Open All Day"}', 1, 1),
('contact', 'Contact Us', 'Phone', '{"phone": "+1 (555) 123-4567", "email": "info@temple.org", "address": "123 Temple Street"}', 2, 1),
('location', 'Find Us', 'MapPin', '{"address": "123 Temple Street", "city": "Sacred City, SC 12345", "parking": "Free Parking Available"}', 3, 1);

-- =============================================================================
-- USEFUL QUERIES FOR FETCHING DATA
-- =============================================================================

/*
-- Get all active slider images
SELECT * FROM homepage_slider WHERE is_active = TRUE ORDER BY display_order;

-- Get welcome section content
SELECT * FROM homepage_welcome WHERE is_active = TRUE LIMIT 1;

-- Get services section content
SELECT 
    h.main_title, h.subtitle,
    c.card_title, c.card_subtitle, c.description, c.image_url, c.icon_name, c.features, c.button_text, c.button_link
FROM homepage_services_header h
CROSS JOIN homepage_services_cards c
WHERE h.is_active = TRUE AND c.is_active = TRUE
ORDER BY c.display_order;

-- Get temple info section
SELECT 
    t.section_title, t.section_subtitle,
    c.card_type, c.card_title, c.icon_name, c.content
FROM homepage_temple_info t
CROSS JOIN homepage_info_cards c
WHERE t.is_active = TRUE AND c.is_active = TRUE
ORDER BY c.display_order;

-- Get user permissions
SELECT username, role, permissions FROM users WHERE is_active = TRUE;
*/ 