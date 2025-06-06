# Temple Website Database Schema

## Overview
This document outlines the database tables and structure needed to support the Hindu Temple website content management system. The schema is designed to work optimally with MySQL and provides full admin control over content.

## Database Tables

### 1. Temple Information (`temple_info`)
Stores basic temple information displayed on the homepage.

```sql
CREATE TABLE temple_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    welcome_message TEXT,
    sanskrit_verse VARCHAR(500),
    sanskrit_translation TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    established_year INT,
    website_url VARCHAR(255),
    main_image_url VARCHAR(500),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Sample data
INSERT INTO temple_info VALUES (
    1,
    'Sacred Hindu Temple',
    'Our temple is a sacred space dedicated to spiritual growth, community service, and preserving Hindu traditions.',
    'Welcome to Our Sacred Temple - A place of divine blessings and spiritual awakening',
    'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः',
    'May all beings be happy, may all beings be free from illness',
    '123 Temple Street, Sacred City, State 12345',
    '+1 (555) 123-4567',
    'info@sacredtemple.org',
    1995,
    'https://sacredtemple.org',
    '/images/temple-main.jpg',
    '/images/temple-logo.png',
    NOW(),
    NOW(),
    TRUE
);
```

### 2. Activities/Events (`activities`)
Stores all temple activities, pujas, and events.

```sql
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    activity_time TIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    location VARCHAR(255),
    priest_name VARCHAR(255),
    max_attendees INT,
    attendee_restriction VARCHAR(255) DEFAULT 'Open to all',
    category ENUM('puja', 'education', 'community', 'festival', 'special') DEFAULT 'puja',
    is_recurring BOOLEAN DEFAULT TRUE,
    recurrence_pattern ENUM('daily', 'weekly', 'monthly', 'yearly', 'custom') DEFAULT 'daily',
    specific_dates JSON, -- For non-recurring events
    days_of_week JSON, -- [0,1,2,3,4,5,6] for Sun-Sat
    start_date DATE,
    end_date DATE,
    image_url VARCHAR(500),
    booking_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO activities VALUES 
(1, 'Morning Aarti', 'Start your day with divine blessings through our morning aarti ceremony.', '06:00:00', 45, 'Main Temple Hall', 'Pandit Ramesh Sharma', NULL, 'Open to all', 'puja', TRUE, 'daily', NULL, '[0,1,2,3,4,5,6]', '2024-01-01', NULL, '/images/morning-aarti.jpg', FALSE, TRUE, NOW(), NOW()),
(2, 'Abhishekam', 'Sacred bathing ritual of the deity with milk, yogurt, honey, and other offerings.', '08:00:00', 60, 'Sanctum Sanctorum', 'Pandit Suresh Iyer', 25, 'Limited to 25', 'puja', TRUE, 'daily', NULL, '[0,1,2,3,4,5,6]', '2024-01-01', NULL, '/images/abhishekam.jpg', TRUE, TRUE, NOW(), NOW()),
(3, 'Bhajan Session', 'Join our devotional singing session with traditional bhajans and kirtans.', '10:00:00', 90, 'Community Hall', 'Mrs. Lakshmi Patel', NULL, 'Open to all', 'community', TRUE, 'daily', NULL, '[0,1,2,3,4,5,6]', '2024-01-01', NULL, '/images/bhajan.jpg', FALSE, TRUE, NOW(), NOW()),
(4, 'Noon Aarti', 'Midday prayer ceremony with special offerings to the deities.', '12:00:00', 30, 'Main Temple Hall', 'Pandit Vijay Kumar', NULL, 'Open to all', 'puja', TRUE, 'daily', NULL, '[0,1,2,3,4,5,6]', '2024-01-01', NULL, '/images/noon-aarti.jpg', FALSE, TRUE, NOW(), NOW()),
(5, 'Vedic Classes', 'Learn about ancient Vedic scriptures and their relevance in modern life.', '16:00:00', 120, 'Education Center', 'Dr. Anand Gupta', 30, 'Registration required', 'education', TRUE, 'weekly', NULL, '[1,3,5]', '2024-01-01', NULL, '/images/vedic-classes.jpg', TRUE, TRUE, NOW(), NOW()),
(6, 'Evening Aarti', 'Evening prayer ceremony with lamps and special offerings.', '18:30:00', 45, 'Main Temple Hall', 'Pandit Ramesh Sharma', NULL, 'Open to all', 'puja', TRUE, 'daily', NULL, '[0,1,2,3,4,5,6]', '2024-01-01', NULL, '/images/evening-aarti.jpg', FALSE, TRUE, NOW(), NOW());
```

### 3. Services (`services`)
Homepage service cards information.

```sql
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    icon VARCHAR(100), -- Lucide icon name
    image_url VARCHAR(500),
    features JSON, -- Array of feature points
    cta_text VARCHAR(100) DEFAULT 'Learn More',
    cta_link VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO services VALUES 
(1, 'Daily Pujas', 'Morning & Evening Ceremonies', 'Join our daily rituals to seek divine blessings and spiritual guidance. Our experienced priests perform traditional ceremonies following ancient Vedic traditions.', 'Calendar', '/images/daily-pujas.jpg', '["Morning Aarti: 6:00 AM", "Noon Aarti: 12:00 PM", "Evening Aarti: 6:30 PM"]', 'View All Ceremonies', '/activities', 1, TRUE, NOW(), NOW()),
(2, 'Community Services', 'Serving Our Community', 'We offer various community services focused on education, cultural preservation, and humanitarian aid. Our temple serves as a center for community growth and support.', 'Users', '/images/community.jpg', '["Free Food Distribution (Sundays)", "Health Camps (Monthly)", "Youth Mentoring Programs"]', 'Join Our Services', '/community', 2, TRUE, NOW(), NOW()),
(3, 'Spiritual Learning', 'Educational Programs', 'Deepen your understanding of Hindu philosophy, scriptures, and spiritual practices through our comprehensive educational programs designed for all age groups.', 'BookOpen', '/images/education.jpg', '["Weekly Bhagavad Gita Classes", "Sanskrit Learning Sessions", "Meditation & Yoga Workshops"]', 'Explore Programs', '/education', 3, TRUE, NOW(), NOW());
```

### 4. Image Gallery (`gallery`)
For homepage image slider and general temple images.

```sql
CREATE TABLE gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    category ENUM('slider', 'general', 'events', 'ceremonies', 'festivals') DEFAULT 'general',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO gallery VALUES 
(1, 'Temple Main Entrance', 'Beautiful main entrance of our sacred temple', '/images/temple-entrance.jpg', 'Temple main entrance', 'slider', 1, TRUE, NOW(), NOW()),
(2, 'Festival Celebration', 'Community celebrating Diwali at the temple', '/images/festival.jpg', 'Temple celebration', 'slider', 2, TRUE, NOW(), NOW()),
(3, 'Temple Interior', 'Sacred interior of the main prayer hall', '/images/interior.jpg', 'Temple interior', 'slider', 3, TRUE, NOW(), NOW()),
(4, 'Cultural Program', 'Traditional dance performance during festival', '/images/cultural.jpg', 'Temple festival', 'slider', 4, TRUE, NOW(), NOW());
```

### 5. Testimonials (`testimonials`)
For the testimonials section on homepage.

```sql
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    location VARCHAR(255),
    testimonial_text TEXT NOT NULL,
    avatar_url VARCHAR(500),
    rating INT DEFAULT 5,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO testimonials VALUES 
(1, 'Priya Sharma', 'Regular Devotee', 'Local Community', 'This temple has been a source of peace and spiritual growth for our entire family. The priests are knowledgeable and the community is welcoming.', '/images/avatars/priya.jpg', 5, TRUE, TRUE, NOW(), NOW()),
(2, 'Rajesh Patel', 'Community Volunteer', 'Nearby Resident', 'I have been volunteering here for over 5 years. The community service programs are excellent and truly make a difference in people\'s lives.', '/images/avatars/rajesh.jpg', 5, TRUE, TRUE, NOW(), NOW()),
(3, 'Meera Gupta', 'Yoga Instructor', 'City Resident', 'The meditation and yoga programs here are exceptional. The peaceful environment helps in achieving deeper spiritual practice.', '/images/avatars/meera.jpg', 5, TRUE, TRUE, NOW(), NOW());
```

### 6. Priests/Staff (`priests`)
Information about temple priests and staff.

```sql
CREATE TABLE priests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    specialization VARCHAR(255),
    bio TEXT,
    experience_years INT,
    languages JSON, -- ["Hindi", "English", "Sanskrit"]
    image_url VARCHAR(500),
    email VARCHAR(100),
    phone VARCHAR(20),
    is_head_priest BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO priests VALUES 
(1, 'Pandit Ramesh Sharma', 'Head Priest', 'Vedic Rituals & Ceremonies', 'With over 20 years of experience in Vedic traditions and rituals, Pandit Ramesh Sharma leads our temple with devotion and deep spiritual knowledge.', 20, '["Hindi", "English", "Sanskrit"]', '/images/priests/ramesh.jpg', 'ramesh@temple.org', '+1 (555) 123-4568', TRUE, TRUE, NOW(), NOW()),
(2, 'Pandit Suresh Iyer', 'Senior Priest', 'Abhishekam & Special Pujas', 'Specialized in conducting elaborate abhishekam ceremonies and special pujas with traditional South Indian practices.', 15, '["Tamil", "Hindi", "English", "Sanskrit"]', '/images/priests/suresh.jpg', 'suresh@temple.org', '+1 (555) 123-4569', FALSE, TRUE, NOW(), NOW());
```

### 7. Contact Information (`contact_info`)
For contact section and footer information.

```sql
CREATE TABLE contact_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('main', 'emergency', 'administrative') DEFAULT 'main',
    department VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    hours_of_operation JSON, -- {"monday": "6:00 AM - 9:00 PM", ...}
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO contact_info VALUES 
(1, 'main', 'General Inquiries', '+1 (555) 123-4567', 'info@sacredtemple.org', '123 Temple Street, Sacred City, State 12345', '{"monday": "6:00 AM - 9:00 PM", "tuesday": "6:00 AM - 9:00 PM", "wednesday": "6:00 AM - 9:00 PM", "thursday": "6:00 AM - 9:00 PM", "friday": "6:00 AM - 9:00 PM", "saturday": "6:00 AM - 9:00 PM", "sunday": "6:00 AM - 9:00 PM"}', TRUE, TRUE, NOW(), NOW()),
(2, 'administrative', 'Administration Office', '+1 (555) 123-4568', 'admin@sacredtemple.org', '123 Temple Street, Sacred City, State 12345', '{"monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 5:00 PM", "friday": "9:00 AM - 5:00 PM", "saturday": "Closed", "sunday": "Closed"}', FALSE, TRUE, NOW(), NOW());
```

### 8. Donations (`donations`)
For donation tracking and management.

```sql
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(100),
    donor_phone VARCHAR(20),
    donor_address TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    purpose ENUM('general', 'construction', 'education', 'community', 'special') DEFAULT 'general',
    payment_method ENUM('credit', 'debit', 'paypal', 'bank_transfer', 'cash', 'check') DEFAULT 'credit',
    transaction_id VARCHAR(255),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    receipt_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 9. Website Settings (`settings`)
For general website configuration.

```sql
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json', 'url') DEFAULT 'text',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO settings VALUES 
(1, 'site_title', 'Sacred Hindu Temple', 'text', 'Main website title', TRUE, NOW(), NOW()),
(2, 'site_description', 'A sacred space for spiritual growth and community service', 'text', 'Website meta description', TRUE, NOW(), NOW()),
(3, 'maintenance_mode', 'false', 'boolean', 'Enable/disable maintenance mode', FALSE, NOW(), NOW()),
(4, 'featured_donation_amounts', '[21, 51, 101, 251, 501, 1001]', 'json', 'Predefined donation amounts', TRUE, NOW(), NOW()),
(5, 'social_media_links', '{"facebook": "https://facebook.com/temple", "instagram": "https://instagram.com/temple", "youtube": "https://youtube.com/temple"}', 'json', 'Social media profile links', TRUE, NOW(), NOW());
```

## API Endpoints Structure

### For FastAPI Backend:

```python
# Main API endpoints needed:

# Temple Info
GET /api/temple-info
PUT /api/temple-info

# Activities
GET /api/activities
GET /api/activities/{date}
GET /api/activities/calendar/{year}/{month}
POST /api/activities
PUT /api/activities/{id}
DELETE /api/activities/{id}

# Services
GET /api/services
POST /api/services
PUT /api/services/{id}
DELETE /api/services/{id}

# Gallery
GET /api/gallery
GET /api/gallery/{category}
POST /api/gallery
PUT /api/gallery/{id}
DELETE /api/gallery/{id}

# Testimonials
GET /api/testimonials
GET /api/testimonials/featured
POST /api/testimonials
PUT /api/testimonials/{id}
DELETE /api/testimonials/{id}

# Donations
POST /api/donations
GET /api/donations (admin only)

# Contact
GET /api/contact-info
POST /api/contact-message

# Settings
GET /api/settings/public
GET /api/settings (admin only)
PUT /api/settings/{key} (admin only)
```

## Admin Dashboard Tables Needed

- Users/Admin authentication
- Content management interfaces for all tables
- Image upload management
- Activity scheduling interface
- Donation management
- Settings configuration

This schema provides complete content management capabilities while maintaining fast query performance with proper indexing on frequently accessed columns. 