# MySQL Setup Guide for User Management System

## Issue Description
The application is getting an "Access denied" error when trying to create client databases. This happens because the MySQL user doesn't have the necessary permissions to create databases.

## Solution

### Step 1: Connect to MySQL as Administrator

Connect to MySQL as root or another user with administrative privileges:

```bash
mysql -u root -p
```

### Step 2: Grant Necessary Permissions

Run the following SQL commands to grant the required permissions:

```sql
-- Grant database creation permissions
GRANT CREATE ON *.* TO 'root'@'localhost';

-- Grant full permissions on client databases (both naming conventions)
GRANT ALL PRIVILEGES ON `client_%`.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON `%_*`.* TO 'root'@'localhost';

-- Grant permissions to read INFORMATION_SCHEMA for checking database/table existence
GRANT SELECT ON information_schema.* TO 'root'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;
```

### Step 3: Verify Permissions

Check that permissions were granted correctly:

```sql
SHOW GRANTS FOR 'root'@'localhost';
```

You should see output similar to:
```
+---------------------------------------------------------------------+
| Grants for root@localhost                                          |
+---------------------------------------------------------------------+
| GRANT CREATE ON *.* TO `root`@`localhost`                         |
| GRANT ALL PRIVILEGES ON `client_%`.* TO `root`@`localhost`        |
| GRANT ALL PRIVILEGES ON `%_*`.* TO `root`@`localhost`             |
| GRANT SELECT ON `information_schema`.* TO `root`@`localhost`      |
+---------------------------------------------------------------------+
```

### Step 4: Test Database Creation

Test that the application can now create databases by running:

```bash
cd backend
python test_first_users.py
```

## Alternative: Using a Different MySQL User

If you're not using the root user, replace 'root' with your actual username in the GRANT statements:

```sql
-- Example for user 'appuser'
GRANT CREATE ON *.* TO 'appuser'@'localhost';
GRANT ALL PRIVILEGES ON `client_%`.* TO 'appuser'@'localhost';
GRANT ALL PRIVILEGES ON `%_*`.* TO 'appuser'@'localhost';
GRANT SELECT ON information_schema.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

And update your `backend/app/core/config.py` file:

```python
class Settings(BaseSettings):
    MYSQL_USER: str = "appuser"  # Change this
    MYSQL_PASSWORD: str = "your_password"  # Change this
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str = "admin_page_db"
```

## Security Considerations

### Production Setup

For production, consider creating a dedicated user with minimal required permissions:

```sql
-- Create a dedicated application user
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant only necessary permissions
GRANT CREATE ON *.* TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON `admin_page_db`.* TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON `client_%`.* TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON `%_*`.* TO 'app_user'@'localhost';
GRANT SELECT ON information_schema.* TO 'app_user'@'localhost';

FLUSH PRIVILEGES;
```

### Permission Explanation

- `CREATE ON *.*`: Allows creating databases
- `ALL PRIVILEGES ON client_%.*`: Full access to databases starting with "client_"
- `ALL PRIVILEGES ON %_*.*`: Full access to databases with the new naming pattern (domain_ownerid)
- `SELECT ON information_schema.*`: Allows checking if databases/tables exist

## Troubleshooting

### Error: "Access denied for user"
- Ensure you're connected to MySQL as a user with administrative privileges
- Check that the username in the GRANT statements matches your application's MySQL user
- Verify the host (usually 'localhost') matches your configuration

### Error: "Can't connect to MySQL server"
- Ensure MySQL service is running
- Check that the host, port, username, and password in your config are correct

### Database Creation Still Fails
- Run `SHOW GRANTS FOR 'your_user'@'localhost';` to verify permissions were applied
- Check MySQL error logs: `sudo tail -f /var/log/mysql/error.log`
- Ensure the application is using the correct database credentials

## Quick Fix Script

You can run the provided script directly:

```bash
# From the backend directory
mysql -u root -p < mysql_permissions.sql
```

This will execute all the necessary GRANT statements automatically. 