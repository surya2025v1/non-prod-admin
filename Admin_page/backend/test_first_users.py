#!/usr/bin/env python3
"""
Test script for the first_users API endpoint.

This script demonstrates how to:
1. Login to get a bearer token
2. Use the first_users endpoint to get users from the first domain database

Note: The endpoint will now only check for existing databases/tables.
- If database {domain}_{owner_id} doesn't exist, returns empty users array
- If database exists but users table doesn't exist, returns empty users array  
- If both exist, returns user data from the users table

Usage:
    python test_first_users.py
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
USERNAME = "admin"  # Replace with your username
PASSWORD = "admin123"  # Replace with your password

def login():
    """Login and get bearer token"""
    url = f"{BASE_URL}/api/v1/login"
    data = {
        "username": USERNAME,
        "password": PASSWORD
    }
    
    response = requests.post(url, data=data)
    if response.status_code == 200:
        result = response.json()
        if result["status"] == "success":
            return result["access_token"]
    
    print(f"Login failed: {response.text}")
    return None

def test_first_users(token):
    """Test the first_users endpoint"""
    url = f"{BASE_URL}/api/v1/first_users"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    print(f"First Users Response ({response.status_code}):")
    result = response.json()
    print(json.dumps(result, indent=2))
    
    # Additional information about the response
    if result.get("data", {}).get("users"):
        print(f"\nFound {len(result['data']['users'])} users in the database")
    else:
        print(f"\nNo users found - this could mean:")
        print("- Database doesn't exist for this domain")
        print("- Users table doesn't exist in the database")
        print("- Users table exists but is empty")
    
    return response.status_code == 200

def main():
    """Main test function"""
    print("Testing first_users API endpoint...")
    print("Note: This endpoint only reads from existing databases and does not create them.")
    
    # Step 1: Login
    print("\n1. Logging in...")
    token = login()
    if not token:
        print("Failed to login. Exiting.")
        return
    
    print(f"Successfully logged in. Token: {token[:20]}...")
    
    # Step 2: Test first_users endpoint
    print("\n2. Testing first_users endpoint...")
    if test_first_users(token):
        print("\nFirst users test completed successfully!")
    else:
        print("\nFirst users test failed")
    
    print("\nTest completed!")

if __name__ == "__main__":
    main() 