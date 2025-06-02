#!/usr/bin/env python3
"""
Test script for the manage_user API endpoint.

This script demonstrates how to:
1. Login to get a bearer token
2. Use the manage_user endpoint to set up user management for a website
3. Check the status of user management setup
4. Get information about available tables

Usage:
    python test_manage_user.py
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
USERNAME = "admin"  # Replace with your username
PASSWORD = "admin123"  # Replace with your password
WEBSITE_ID = 1  # Replace with your website ID

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

def test_manage_user(token):
    """Test the manage_user endpoint"""
    url = f"{BASE_URL}/api/v1/manage_user"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {
        "website_id": WEBSITE_ID
    }
    
    response = requests.post(url, headers=headers, params=params)
    print(f"Manage User Response ({response.status_code}):")
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

def test_status(token):
    """Test the user management status endpoint"""
    url = f"{BASE_URL}/api/v1/manage_user/status"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {
        "website_id": WEBSITE_ID
    }
    
    response = requests.get(url, headers=headers, params=params)
    print(f"\nStatus Response ({response.status_code}):")
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

def test_tables(token):
    """Test the available tables endpoint"""
    url = f"{BASE_URL}/api/v1/manage_user/tables"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {
        "website_id": WEBSITE_ID
    }
    
    response = requests.get(url, headers=headers, params=params)
    print(f"\nTables Response ({response.status_code}):")
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

def main():
    """Main test function"""
    print("Testing manage_user API endpoints...")
    
    # Step 1: Login
    print("1. Logging in...")
    token = login()
    if not token:
        print("Failed to login. Exiting.")
        return
    
    print(f"Successfully logged in. Token: {token[:20]}...")
    
    # Step 2: Test manage_user endpoint
    print("\n2. Testing manage_user endpoint...")
    if not test_manage_user(token):
        print("Manage user test failed")
        return
    
    # Step 3: Test status endpoint
    print("\n3. Testing status endpoint...")
    test_status(token)
    
    # Step 4: Test tables endpoint
    print("\n4. Testing tables endpoint...")
    test_tables(token)
    
    print("\nAll tests completed!")

if __name__ == "__main__":
    main() 