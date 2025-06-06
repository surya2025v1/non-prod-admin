-- Migration script to extend existing users table for Login/Signup service
-- This script safely adds new columns to the existing users table

USE svtemple_2;

-- Add new columns to existing users table
-- Use IF NOT EXISTS equivalent for MySQL (checking column existence)

-- Check if first_name column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN first_name VARCHAR(50) NOT NULL DEFAULT ""',
        'SELECT "first_name column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'first_name'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if last_name column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN last_name VARCHAR(50) NOT NULL DEFAULT ""',
        'SELECT "last_name column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'last_name'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if created_at column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
        'SELECT "created_at column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'created_at'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if updated_at column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        'SELECT "updated_at column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'updated_at'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if last_login column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN last_login DATETIME NULL',
        'SELECT "last_login column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'last_login'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Security columns for login attempt tracking

-- Check if failed_login_attempts column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN failed_login_attempts INT DEFAULT 0 NOT NULL',
        'SELECT "failed_login_attempts column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'failed_login_attempts'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if locked_until column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN locked_until DATETIME NULL',
        'SELECT "locked_until column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'locked_until'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if last_failed_login column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN last_failed_login DATETIME NULL',
        'SELECT "last_failed_login column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'last_failed_login'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if password_changed_at column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN password_changed_at DATETIME DEFAULT CURRENT_TIMESTAMP',
        'SELECT "password_changed_at column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'password_changed_at'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if email_verified column exists, if not add it
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL',
        'SELECT "email_verified column already exists" as message'
    )
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'email_verified'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing users to have default values for first_name and last_name
-- Only update if the columns exist and are empty
UPDATE users 
SET 
    first_name = COALESCE(NULLIF(first_name, ''), 'User'),
    last_name = COALESCE(NULLIF(last_name, ''), 'Name')
WHERE 
    (first_name = '' OR first_name IS NULL) OR 
    (last_name = '' OR last_name IS NULL);

-- Create indexes for better performance (only if they don't exist)

-- Index for email
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_users_email ON users(email)',
        'SELECT "idx_users_email already exists" as message'
    )
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND INDEX_NAME = 'idx_users_email'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index for username
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_users_username ON users(username)',
        'SELECT "idx_users_username already exists" as message'
    )
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND INDEX_NAME = 'idx_users_username'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index for is_active
SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_users_active ON users(is_active)',
        'SELECT "idx_users_active already exists" as message'
    )
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'svtemple_2' 
    AND TABLE_NAME = 'users' 
    AND INDEX_NAME = 'idx_users_active'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Show final table structure
DESCRIBE users;

-- Show sample of updated data
SELECT 
    id, 
    first_name, 
    last_name, 
    email, 
    username, 
    role, 
    is_active,
    created_at,
    failed_login_attempts,
    email_verified
FROM users 
LIMIT 5;

-- Summary
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
    COUNT(CASE WHEN email_verified = 1 THEN 1 END) as verified_users
FROM users; 