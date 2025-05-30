-- Use the database
USE admin_page_db;

-- Insert test users
-- Note: In a real application, passwords should be properly hashed
-- These are just for testing purposes
INSERT INTO users (
    username,
    email,
    passwordHash,
    salt,
    isActive,
    isVerified,
    firstName,
    lastName,
    role,
    createdAt,
    updatedAt
) VALUES 
-- Admin user
(
    'admin_user',
    'admin@example.com',
    'hashed_password_1', -- In real app, this would be a proper hash
    'salt_1',
    true,
    true,
    'Admin',
    'User',
    'admin',
    NOW(),
    NOW()
),
-- Regular active user
(
    'john_doe',
    'john@example.com',
    'hashed_password_2',
    'salt_2',
    true,
    true,
    'John',
    'Doe',
    'user',
    NOW(),
    NOW()
),
-- Unverified user
(
    'jane_smith',
    'jane@example.com',
    'hashed_password_3',
    'salt_3',
    true,
    false,
    'Jane',
    'Smith',
    'user',
    NOW(),
    NOW()
),
-- Inactive user
(
    'bob_wilson',
    'bob@example.com',
    'hashed_password_4',
    'salt_4',
    false,
    true,
    'Bob',
    'Wilson',
    'user',
    NOW(),
    NOW()
),
-- User with failed login attempts
(
    'alice_brown',
    'alice@example.com',
    'hashed_password_5',
    'salt_5',
    true,
    true,
    'Alice',
    'Brown',
    'user',
    NOW(),
    NOW()
);

-- Update some specific test cases
UPDATE users 
SET failedLoginAttempts = 3,
    accountLockedUntil = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
WHERE username = 'alice_brown';

UPDATE users 
SET lastLogin = DATE_SUB(NOW(), INTERVAL 1 DAY)
WHERE username = 'john_doe';

UPDATE users 
SET verificationToken = 'test_verification_token_123'
WHERE username = 'jane_smith';

-- Insert a moderator
INSERT INTO users (
    username,
    email,
    passwordHash,
    salt,
    isActive,
    isVerified,
    firstName,
    lastName,
    role,
    createdAt,
    updatedAt
) VALUES (
    'mod_sarah',
    'sarah@example.com',
    'hashed_password_6',
    'salt_6',
    true,
    true,
    'Sarah',
    'Johnson',
    'moderator',
    NOW(),
    NOW()
);

-- Insert sample websites for testing
INSERT INTO websites (
    owner_id,
    name,
    status,
    organization_name,
    organization_type,
    tagline,
    contact_email,
    contact_phone,
    address,
    primary_color,
    secondary_color,
    font,
    intro_text,
    about,
    mission,
    paid_till,
    domain,
    is_active,
    page_no,
    created_at,
    last_updated
) VALUES 
-- Website for john_doe
(
    (SELECT id FROM users WHERE username = 'john_doe'),
    'John Portfolio',
    'published',
    'John Doe Portfolio',
    'Portfolio',
    'Professional Web Developer',
    'john@example.com',
    '+1-555-0123',
    '123 Main St, City, State',
    '#0ea5e9',
    '#f0f9ff',
    'Inter',
    'Welcome to my professional portfolio showcasing my web development skills.',
    'I am a passionate web developer with 5 years of experience in creating modern, responsive websites.',
    'To deliver exceptional web solutions that help businesses grow and succeed online.',
    '2024-12-31',
    'johndoe.websitebuilder.com',
    true,
    1,
    NOW(),
    NOW()
),
-- Another website for john_doe
(
    (SELECT id FROM users WHERE username = 'john_doe'),
    'Tech Blog',
    'draft',
    'Tech Insights Blog',
    'Blog',
    'Latest in Technology',
    'blog@johndoe.com',
    '+1-555-0124',
    '456 Tech Ave, Silicon Valley',
    '#10b981',
    '#f0fdf4',
    'Roboto',
    'Stay updated with the latest technology trends and insights.',
    'A blog dedicated to sharing knowledge about emerging technologies and development practices.',
    'To educate and inform the tech community about latest innovations.',
    NULL,
    'techblog.websitebuilder.com',
    true,
    2,
    NOW(),
    NOW()
),
-- Website for admin_user
(
    (SELECT id FROM users WHERE username = 'admin_user'),
    'Admin Dashboard',
    'published',
    'Admin Control Panel',
    'Dashboard',
    'System Management',
    'admin@example.com',
    '+1-555-0100',
    '789 Admin Blvd, Corporate Center',
    '#dc2626',
    '#fef2f2',
    'Montserrat',
    'Comprehensive administrative dashboard for system management.',
    'Central hub for managing all system operations and user activities.',
    'To provide efficient tools for system administration and monitoring.',
    '2025-01-31',
    'admin.websitebuilder.com',
    true,
    1,
    NOW(),
    NOW()
),
-- Website for jane_smith
(
    (SELECT id FROM users WHERE username = 'jane_smith'),
    'Creative Studio',
    'draft',
    'Jane Smith Creative',
    'Creative Agency',
    'Where Art Meets Innovation',
    'jane@example.com',
    '+1-555-0125',
    '321 Creative Way, Art District',
    '#8b5cf6',
    '#faf5ff',
    'Poppins',
    'Bringing your creative visions to life through innovative design.',
    'A creative studio specializing in brand identity, web design, and digital marketing.',
    'To help brands tell their story through compelling visual experiences.',
    NULL,
    'janecreative.websitebuilder.com',
    true,
    1,
    NOW(),
    NOW()
); 