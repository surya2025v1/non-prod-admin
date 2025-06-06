#!/usr/bin/env python3
"""
Database connection test script for troubleshooting.
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv("env")

def test_db_connection():
    """Test database connection and provide diagnostics."""
    
    # Get database configuration
    db_config = {
        'host': os.getenv("DATABASE_HOST", "localhost"),
        'port': int(os.getenv("DATABASE_PORT", "3306")),
        'user': os.getenv("DATABASE_USER", "root"),
        'password': os.getenv("DATABASE_PASSWORD", "new_password"),
        'database': os.getenv("DATABASE_NAME", "svtemple_2")
    }
    
    print("🔧 Database Connection Test")
    print("=" * 50)
    print(f"Host: {db_config['host']}")
    print(f"Port: {db_config['port']}")
    print(f"User: {db_config['user']}")
    print(f"Database: {db_config['database']}")
    print("=" * 50)
    
    # Test 1: Basic MySQL server connection
    try:
        print("\n1️⃣ Testing MySQL server connection...")
        connection = mysql.connector.connect(
            host=db_config['host'],
            port=db_config['port'],
            user=db_config['user'],
            password=db_config['password']
        )
        print("✅ MySQL server connection successful")
        
        # Test 2: Check if database exists
        print("\n2️⃣ Checking if database exists...")
        cursor = connection.cursor()
        cursor.execute(f"SHOW DATABASES LIKE '{db_config['database']}'")
        result = cursor.fetchone()
        
        if result:
            print(f"✅ Database '{db_config['database']}' exists")
            
            # Test 3: Connect to specific database
            print("\n3️⃣ Testing connection to specific database...")
            connection.close()
            
            connection = mysql.connector.connect(**db_config)
            print(f"✅ Successfully connected to database '{db_config['database']}'")
            
            # Test 4: Check if users table exists
            print("\n4️⃣ Checking for users table...")
            cursor = connection.cursor()
            cursor.execute("SHOW TABLES LIKE 'users'")
            table_result = cursor.fetchone()
            
            if table_result:
                print("✅ Users table exists")
                
                # Show table structure
                cursor.execute("DESCRIBE users")
                columns = cursor.fetchall()
                print("\n📊 Current users table structure:")
                for column in columns:
                    field, field_type, null, key, default, extra = column
                    print(f"  {field}: {field_type}")
                
            else:
                print("❌ Users table does not exist")
                print("💡 You need to create the users table first")
        
        else:
            print(f"❌ Database '{db_config['database']}' does not exist")
            print("\n📋 Available databases:")
            cursor.execute("SHOW DATABASES")
            for db in cursor.fetchall():
                print(f"  - {db[0]}")
            
            print(f"\n💡 To create the database, run:")
            print(f"   mysql -u {db_config['user']} -p")
            print(f"   CREATE DATABASE {db_config['database']};")
        
        connection.close()
        return True
        
    except Error as e:
        print(f"❌ Database connection failed: {e}")
        print("\n🔍 Troubleshooting steps:")
        
        if "Access denied" in str(e):
            print("  1. Check if password is correct")
            print("  2. Verify user has proper permissions")
            print(f"     GRANT ALL PRIVILEGES ON {db_config['database']}.* TO '{db_config['user']}'@'localhost';")
        
        elif "Can't connect to MySQL server" in str(e):
            print("  1. Check if MySQL server is running:")
            print("     brew services start mysql  # On macOS")
            print("     sudo service mysql start   # On Linux")
            print("  2. Check if port 3306 is open")
            print("  3. Verify host and port settings")
        
        elif "Unknown database" in str(e):
            print(f"  1. Create the database: CREATE DATABASE {db_config['database']};")
        
        else:
            print("  1. Check MySQL server status")
            print("  2. Verify connection parameters")
            print("  3. Check firewall settings")
        
        return False

def main():
    """Main test function."""
    try:
        success = test_db_connection()
        
        if success:
            print("\n🎉 Database connection test passed!")
            print("✅ Ready to run the application")
        else:
            print("\n❌ Database connection test failed!")
            print("🔧 Please resolve the issues above before starting the application")
        
        return 0 if success else 1
        
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    exit(main()) 