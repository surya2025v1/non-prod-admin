-- Create a new user for the application
CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'app_password';

-- Grant specific permissions to only access the users table
GRANT SELECT, INSERT, UPDATE ON admin_page_db.users TO 'app_user'@'localhost';
 
-- Apply the changes
FLUSH PRIVILEGES; 