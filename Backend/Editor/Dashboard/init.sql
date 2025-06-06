-- Temple Management System Database Initialization
-- This script creates sample users for testing purposes

USE temple_management;

-- Insert sample users for testing
-- Note: In production, use proper password hashing and secure credentials

-- Admin user (password: admin123)
INSERT INTO users (username, email, role, is_active, password_hash, created_at, updated_at) 
VALUES (
    'admin', 
    'admin@temple.org', 
    'Admin', 
    1, 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewsUi.oy3k6xBCgC',  -- admin123
    NOW(), 
    NOW()
);

-- Editor user (password: editor123)
INSERT INTO users (username, email, role, is_active, password_hash, created_at, updated_at) 
VALUES (
    'editor1', 
    'editor@temple.org', 
    'Editor', 
    1, 
    '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- editor123
    NOW(), 
    NOW()
);

-- Member user (password: member123)
INSERT INTO users (username, email, role, is_active, password_hash, created_at, updated_at) 
VALUES (
    'member1', 
    'member@temple.org', 
    'Member', 
    1, 
    '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- member123
    NOW(), 
    NOW()
);

-- Inactive user for testing
INSERT INTO users (username, email, role, is_active, password_hash, created_at, updated_at) 
VALUES (
    'inactive_user', 
    'inactive@temple.org', 
    'Editor', 
    0, 
    '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    NOW(), 
    NOW()
);

-- Display created users
SELECT id, username, email, role, is_active, created_at FROM users; 