#!/usr/bin/env python3
"""
Dynamic database migration script for Login/Signup service.
This script reads database configuration from the environment file and 
safely adds new columns to the existing users table.
"""

import os
import sys
from pathlib import Path
import mysql.connector
from mysql.connector import Error
import logging

# Add the app directory to Python path for imports
sys.path.append(str(Path(__file__).parent / "app"))

try:
    from app.core.config import settings
except ImportError:
    # Fallback: read env file manually if app imports fail
    from dotenv import load_dotenv
    load_dotenv("env")
    
    class FallbackSettings:
        DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
        DATABASE_PORT = int(os.getenv("DATABASE_PORT", "3306"))
        DATABASE_USER = os.getenv("DATABASE_USER", "root")
        DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", "password")
        DATABASE_NAME = os.getenv("DATABASE_NAME", "svtemple_2")
    
    settings = FallbackSettings()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def get_db_connection():
    """Create database connection using settings from env file."""
    try:
        connection = mysql.connector.connect(
            host=settings.DATABASE_HOST,
            port=settings.DATABASE_PORT,
            user=settings.DATABASE_USER,
            password=settings.DATABASE_PASSWORD,
            database=settings.DATABASE_NAME,
            charset='utf8mb4',
            collation='utf8mb4_general_ci'
        )
        
        if connection.is_connected():
            logger.info(f"Successfully connected to database: {settings.DATABASE_NAME}")
            return connection
            
    except Error as e:
        logger.error(f"Error connecting to database: {e}")
        return None


def column_exists(cursor, table_name, column_name):
    """Check if a column exists in a table."""
    query = """
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = %s 
    AND TABLE_NAME = %s 
    AND COLUMN_NAME = %s
    """
    cursor.execute(query, (settings.DATABASE_NAME, table_name, column_name))
    count = cursor.fetchone()[0]
    return count > 0


def index_exists(cursor, table_name, index_name):
    """Check if an index exists on a table."""
    query = """
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = %s 
    AND TABLE_NAME = %s 
    AND INDEX_NAME = %s
    """
    cursor.execute(query, (settings.DATABASE_NAME, table_name, index_name))
    count = cursor.fetchone()[0]
    return count > 0


def add_column_if_not_exists(cursor, table_name, column_name, column_definition):
    """Add a column to a table if it doesn't already exist."""
    if not column_exists(cursor, table_name, column_name):
        query = f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}"
        cursor.execute(query)
        logger.info(f"✅ Added column: {column_name}")
        return True
    else:
        logger.info(f"⏭️  Column {column_name} already exists")
        return False


def add_index_if_not_exists(cursor, table_name, index_name, columns):
    """Add an index to a table if it doesn't already exist."""
    if not index_exists(cursor, table_name, index_name):
        query = f"CREATE INDEX {index_name} ON {table_name}({columns})"
        cursor.execute(query)
        logger.info(f"✅ Added index: {index_name}")
        return True
    else:
        logger.info(f"⏭️  Index {index_name} already exists")
        return False


def migrate_users_table():
    """Main migration function to extend the users table."""
    logger.info("🚀 Starting database migration for Login/Signup service")
    logger.info(f"📊 Database: {settings.DATABASE_NAME}")
    logger.info(f"🖥️  Host: {settings.DATABASE_HOST}:{settings.DATABASE_PORT}")
    logger.info(f"👤 User: {settings.DATABASE_USER}")
    
    connection = get_db_connection()
    if not connection:
        logger.error("❌ Failed to connect to database")
        return False
    
    try:
        cursor = connection.cursor()
        
        # Check if users table exists
        cursor.execute("SHOW TABLES LIKE 'users'")
        if not cursor.fetchone():
            logger.error("❌ Users table does not exist. Please create it first.")
            return False
        
        logger.info("📋 Users table found. Starting migration...")
        
        # Track changes
        changes_made = 0
        
        # Add new columns for enhanced user schema
        columns_to_add = [
            ("first_name", "VARCHAR(50) NOT NULL DEFAULT ''"),
            ("last_name", "VARCHAR(50) NOT NULL DEFAULT ''"),
            ("created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP"),
            ("updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
            ("last_login", "DATETIME NULL"),
            ("failed_login_attempts", "INT DEFAULT 0 NOT NULL"),
            ("locked_until", "DATETIME NULL"),
            ("last_failed_login", "DATETIME NULL"),
            ("password_changed_at", "DATETIME DEFAULT CURRENT_TIMESTAMP"),
            ("email_verified", "BOOLEAN DEFAULT FALSE NOT NULL")
        ]
        
        logger.info("🔧 Adding new columns...")
        for column_name, column_def in columns_to_add:
            if add_column_if_not_exists(cursor, "users", column_name, column_def):
                changes_made += 1
        
        # Update existing users with default values for first_name and last_name
        logger.info("🔄 Updating existing users with default names...")
        update_query = """
        UPDATE users 
        SET 
            first_name = COALESCE(NULLIF(first_name, ''), 'User'),
            last_name = COALESCE(NULLIF(last_name, ''), 'Name')
        WHERE 
            (first_name = '' OR first_name IS NULL) OR 
            (last_name = '' OR last_name IS NULL)
        """
        cursor.execute(update_query)
        updated_rows = cursor.rowcount
        if updated_rows > 0:
            logger.info(f"✅ Updated {updated_rows} existing users with default names")
            changes_made += 1
        
        # Add indexes for better performance
        logger.info("📇 Adding database indexes...")
        indexes_to_add = [
            ("idx_users_email", "email"),
            ("idx_users_username", "username"),
            ("idx_users_active", "is_active")
        ]
        
        for index_name, columns in indexes_to_add:
            if add_index_if_not_exists(cursor, "users", index_name, columns):
                changes_made += 1
        
        # Commit all changes
        connection.commit()
        
        # Show final table structure
        logger.info("📊 Current table structure:")
        cursor.execute("DESCRIBE users")
        columns = cursor.fetchall()
        
        print("\n" + "="*60)
        print("USERS TABLE STRUCTURE")
        print("="*60)
        for column in columns:
            field, field_type, null, key, default, extra = column
            print(f"{field:<25} {field_type:<25} {null:<5} {key:<5} {str(default):<15} {extra}")
        
        # Show sample data
        logger.info("📝 Sample user data:")
        cursor.execute("""
        SELECT 
            id, first_name, last_name, email, username, role, is_active,
            created_at, failed_login_attempts, email_verified
        FROM users 
        LIMIT 3
        """)
        
        sample_users = cursor.fetchall()
        if sample_users:
            print("\n" + "="*60)
            print("SAMPLE USER DATA")
            print("="*60)
            for user in sample_users:
                print(f"ID: {user[0]}, Name: {user[1]} {user[2]}, Email: {user[3]}")
                print(f"  Role: {user[5]}, Active: {user[6]}, Failed Logins: {user[8]}")
        
        # Show statistics
        cursor.execute("""
        SELECT 
            COUNT(*) as total_users,
            COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
            COUNT(CASE WHEN email_verified = 1 THEN 1 END) as verified_users
        FROM users
        """)
        
        stats = cursor.fetchone()
        print(f"\n📈 DATABASE STATISTICS:")
        print(f"  Total Users: {stats[0]}")
        print(f"  Active Users: {stats[1]}")
        print(f"  Verified Users: {stats[2]}")
        
        if changes_made > 0:
            logger.info(f"✅ Migration completed successfully! {changes_made} changes made.")
        else:
            logger.info("✅ Migration completed - database was already up to date.")
        
        return True
        
    except Error as e:
        logger.error(f"❌ Migration failed: {e}")
        connection.rollback()
        return False
        
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            logger.info("🔌 Database connection closed")


def main():
    """Main function to run the migration."""
    print("🔧 Temple Management System - Database Migration")
    print("=" * 60)
    
    try:
        success = migrate_users_table()
        
        if success:
            print("\n🎉 Migration completed successfully!")
            print("\n💡 Next steps:")
            print("1. Start the Login/Signup service: python app/main.py")
            print("2. Test the API endpoints: python test_auth_api.py")
            print("3. Access API docs: http://localhost:8002/docs")
            return 0
        else:
            print("\n❌ Migration failed. Please check the logs above.")
            return 1
            
    except KeyboardInterrupt:
        print("\n⏹️  Migration cancelled by user")
        return 1
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code) 