#!/usr/bin/env python3
"""
Test script for the get_my_users API endpoint.

This script demonstrates how to:
1. Login to get a bearer token
2. Use the get_my_users endpoint to get users from a specific domain database

The endpoint requires a domain (domain name) parameter and will:
- Validate that the domain belongs to the authenticated user with status 'published'
- Check if the domain database exists
- Return users from the domain's users table if everything exists
- Return empty response if database/table doesn't exist

Usage:
    python test_get_my_users.py [domain_name]
"""

import requests
import json
import sys

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

def get_user_websites(token):
    """Get user's websites to show available domains"""
    url = f"{BASE_URL}/api/v1/websites"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        websites = response.json()
        if websites:
            print("Available websites:")
            for website in websites:
                print(f"  ID: {website.get('id', 'N/A')}, Name: {website.get('name', 'N/A')}, Domain: {website.get('domain', 'N/A')}, Status: {website.get('status', 'N/A')}")
            return websites
    
    print("No websites found or error fetching websites")
    return []

def test_get_my_users(token, domain):
    """Test the get_my_users endpoint"""
    url = f"{BASE_URL}/api/v1/get_my_users"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {
        "domain": domain
    }
    
    response = requests.get(url, headers=headers, params=params)
    print(f"Get My Users Response ({response.status_code}):")
    result = response.json()
    print(json.dumps(result, indent=2))
    
    # Additional information about the response
    if result.get("data", {}).get("users"):
        print(f"\nFound {len(result['data']['users'])} users in the database")
        if result.get("data", {}).get("website_info"):
            website_info = result["data"]["website_info"]
            print(f"Website: {website_info.get('name', 'N/A')} (Domain: {website_info.get('domain', 'N/A')})")
    else:
        print(f"\nNo users found - this could mean:")
        print("- Domain doesn't belong to you")
        print("- Website status is not 'published'")
        print("- Database doesn't exist for this domain")
        print("- Users table doesn't exist in the database")
        print("- Users table exists but is empty")
    
    return response.status_code == 200

def main():
    """Main test function"""
    print("Testing get_my_users API endpoint...")
    print("Note: This endpoint only reads from existing databases and does not create them.")
    
    # Get domain from command line argument or prompt
    domain = None
    if len(sys.argv) > 1:
        domain = sys.argv[1]
    
    # Step 1: Login
    print("\n1. Logging in...")
    token = login()
    if not token:
        print("Failed to login. Exiting.")
        return
    
    print(f"Successfully logged in. Token: {token[:20]}...")
    
    # Step 2: Show available websites if no domain provided
    if domain is None:
        print("\n2. Fetching your websites...")
        websites = get_user_websites(token)
        if not websites:
            print("No websites found. Cannot test endpoint.")
            return
        
        domain = input("\nEnter a domain name to test: ").strip()
        if not domain:
            print("No domain entered.")
            return
    
    # Step 3: Test get_my_users endpoint
    print(f"\n3. Testing get_my_users endpoint with domain: {domain}...")
    if test_get_my_users(token, domain):
        print("\nGet my users test completed successfully!")
    else:
        print("\nGet my users test failed")
    
    print("\nTest completed!")

if __name__ == "__main__":
    main() 