-- MySQL Permissions Script
-- Run this script as a MySQL administrator (root user) to grant necessary permissions

-- Grant permissions to the application user
-- Replace 'root' with your actual MySQL username if different
-- Replace 'new_password' with your actual MySQL password if different
-- Replace 'localhost' with your actual host if different

-- Grant database creation permissions
GRANT CREATE ON *.* TO 'root'@'localhost';

-- Grant full permissions on databases matching the pattern for client databases
GRANT ALL PRIVILEGES ON `client_%`.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON `%_*`.* TO 'root'@'localhost';

-- Grant permissions to read INFORMATION_SCHEMA for checking database/table existence
GRANT SELECT ON information_schema.* TO 'root'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Show current permissions (optional - for verification)
SHOW GRANTS FOR 'root'@'localhost'; 