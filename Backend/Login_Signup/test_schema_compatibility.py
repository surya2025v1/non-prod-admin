#!/usr/bin/env python3
"""
Test script to verify database schema compatibility with updated models.
"""

import sys
from pathlib import Path

# Add the app directory to Python path
sys.path.append(str(Path(__file__).parent / "app"))

try:
    from app.core.database import get_db, engine
    from app.models.user import User
    from sqlalchemy.orm import Session
    from sqlalchemy import text
    import os
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv("env")
    
    def test_schema_compatibility():
        """Test if the application model works with existing database schema."""
        
        print("🔧 Testing Database Schema Compatibility")
        print("=" * 50)
        
        try:
            # Test database connection
            print("1️⃣ Testing database connection...")
            db: Session = next(get_db())
            
            # Test if we can query the users table with our model
            print("2️⃣ Testing User model compatibility...")
            user_count = db.query(User).count()
            print(f"✅ Successfully queried users table: {user_count} users found")
            
            # Test if we can select specific columns that our model expects
            print("3️⃣ Testing column access...")
            
            # Test a sample query with all model fields
            sample_query = db.query(
                User.id,
                User.username, 
                User.email,
                User.password_hash,
                User.salt,
                User.first_name,
                User.last_name,
                User.role,
                User.is_active,
                User.is_verified,
                User.failed_login_attempts,
                User.account_locked_until,
                User.last_login,
                User.created_at,
                User.updated_at
            ).limit(1)
            
            result = sample_query.first()
            if result:
                print(f"✅ Sample user data access successful")
                print(f"   ID: {result.id}")
                print(f"   Email: {result.email}")
                print(f"   Role: {result.role}")
                print(f"   Active: {result.is_active}")
            else:
                print("ℹ️  No users in database yet")
            
            # Test model property methods
            print("4️⃣ Testing model methods...")
            if result:
                # Create a User object to test methods
                user = db.query(User).first()
                if user:
                    print(f"✅ User full name: {user.full_name}")
                    print(f"✅ User role enum: {user.user_role}")
                    print(f"✅ Has permission: {user.has_permission()}")
                    print(f"✅ Is account locked: {user.is_account_locked()}")
                    print(f"✅ Email verified (alias): {user.email_verified}")
            
            db.close()
            return True
            
        except Exception as e:
            print(f"❌ Schema compatibility test failed: {e}")
            if db:
                db.close()
            return False
    
    def main():
        """Main test function."""
        try:
            success = test_schema_compatibility()
            
            if success:
                print("\n🎉 Schema compatibility test passed!")
                print("✅ Application model is compatible with existing database")
                print("✅ Ready to run the Login/Signup service")
            else:
                print("\n❌ Schema compatibility test failed!")
                print("🔧 Please check the error messages above")
            
            return 0 if success else 1
            
        except Exception as e:
            print(f"\n💥 Unexpected error: {e}")
            return 1

    if __name__ == "__main__":
        exit(main())
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 Make sure you're in the Login_Signup directory and dependencies are installed")
    print("   Run: pip install -r requirements.txt")
    exit(1) 