-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS admin_page_db;

-- Use the database
USE admin_page_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    -- Primary Key
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Unique identifier for each user, auto-increments
    -- Used for database relationships and user tracking
    -- Cannot be null and must be unique

    -- Authentication Fields
    username VARCHAR(50) UNIQUE NOT NULL,
    -- User's login username
    -- Limited to 50 characters for security and practicality
    -- Must be unique across all users
    -- Used for login identification

    email VARCHAR(100) UNIQUE NOT NULL,
    -- User's email address
    -- Limited to 100 characters (standard email length)
    -- Must be unique
    -- Used for account verification and password recovery
    -- Primary contact method for user communication

    password_hash VARCHAR(255) NOT NULL,
    -- Hashed version of the user's password
    -- Never stores plain text passwords
    -- 255 characters to accommodate various hashing algorithms
    -- Should be hashed using a secure algorithm (e.g., bcrypt)

    salt VARCHAR(255) NOT NULL,
    -- Random string used in password hashing
    -- Adds extra security to password storage
    -- Unique for each user
    -- Helps prevent rainbow table attacks

    -- Account Status Fields
    is_active BOOLEAN DEFAULT true,
    -- Indicates if the account is active
    -- Can be used to temporarily disable accounts
    -- Default to true for new accounts
    -- Useful for account management and security

    is_verified BOOLEAN DEFAULT false,
    -- Indicates if the email has been verified
    -- Important for security and preventing fake accounts
    -- Default to false until email verification
    -- Used to control access to certain features

    verification_token VARCHAR(255),
    -- Token used for email verification
    -- Null after successful verification
    -- Used in verification links
    -- Temporary token for account verification process

    -- Security and Login Fields
    last_login DATETIME,
    -- Records the last successful login time
    -- Useful for security monitoring
    -- Can be used to detect suspicious activity
    -- Helps track user activity

    failed_login_attempts INT DEFAULT 0,
    -- Tracks failed login attempts
    -- Used for implementing login attempt limits
    -- Can be reset after successful login
    -- Important for security and preventing brute force attacks

    account_locked_until DATETIME,
    -- Timestamp when account will be unlocked
    -- Used for temporary account locking after too many failed attempts
    -- Null when account is not locked
    -- Security feature to prevent brute force attacks

    -- User Information Fields
    first_name VARCHAR(50) NOT NULL,
    -- User's first name
    -- Required field
    -- Used for personalization and display
    -- Limited to 50 characters

    last_name VARCHAR(50) NOT NULL,
    -- User's last name
    -- Required field
    -- Used for personalization and display
    -- Limited to 50 characters

    role VARCHAR(20) DEFAULT 'user',
    -- User's role in the system
    -- Default is 'user'
    -- Used for access control and permissions
    -- Can be: 'admin', 'user', 'moderator', etc.

    -- Timestamp Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- When the account was created
    -- Automatically set to current time
    -- Useful for auditing and user management
    -- Helps track user account age

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- When the account was last updated
    -- Automatically updates when any field is modified
    -- Useful for tracking changes
    -- Helps with data auditing
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create websites table
CREATE TABLE IF NOT EXISTS websites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    status ENUM('draft', 'processing...','published', 'archived') DEFAULT 'draft',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    organization_name VARCHAR(100),
    organization_type VARCHAR(50),
    tagline VARCHAR(255),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(30),
    address VARCHAR(255),
    logo_url VARCHAR(255),
    favicon_url VARCHAR(255),
    primary_color VARCHAR(20),
    secondary_color VARCHAR(20),
    font VARCHAR(50),
    hero_image_url VARCHAR(255),
    banner_image_url VARCHAR(255),
    intro_text TEXT,
    photo_gallery_urls JSON,
    video_youtube_link VARCHAR(255),
    about TEXT,
    mission TEXT,
    history TEXT,
    services_offerings JSON,
    team_members JSON,
    social_media_links JSON,
    paid_till DATE,
    domain VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    page_no INT,
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);
