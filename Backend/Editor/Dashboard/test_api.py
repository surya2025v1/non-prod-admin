#!/usr/bin/env python3
"""
Test script for Temple Management System API
This script demonstrates how to use the authentication and dashboard endpoints.
"""

import requests
import json
from app.core.security import create_access_token

# API Base URL
BASE_URL = "http://localhost:8000"

def create_test_token(user_id: int = 1) -> str:
    """Create a test JWT token for user ID"""
    return create_access_token(subject=str(user_id))

def test_health_check():
    """Test health check endpoints"""
    print("=== Testing Health Check Endpoints ===")
    
    # Test root endpoint
    response = requests.get(f"{BASE_URL}/")
    print(f"GET / - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    # Test health endpoint
    response = requests.get(f"{BASE_URL}/health")
    print(f"GET /health - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_authentication_endpoints():
    """Test authentication endpoints"""
    print("=== Testing Authentication Endpoints ===")
    
    # Create test token
    token = create_test_token(user_id=1)  # Admin user
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test check-permission endpoint
    response = requests.post(f"{BASE_URL}/api/v1/auth/check-permission", headers=headers)
    print(f"POST /api/v1/auth/check-permission - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.text}")
    print()
    
    # Test auth status endpoint
    response = requests.get(f"{BASE_URL}/api/v1/auth/status", headers=headers)
    print(f"GET /api/v1/auth/status - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.text}")
    print()
    
    # Test token validation endpoint
    response = requests.get(f"{BASE_URL}/api/v1/auth/validate-token", headers=headers)
    print(f"GET /api/v1/auth/validate-token - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.text}")
    print()

def test_dashboard_endpoints():
    """Test dashboard endpoints"""
    print("=== Testing Dashboard Endpoints ===")
    
    # Create test token for admin user
    token = create_test_token(user_id=1)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test dashboard metrics endpoint
    response = requests.get(f"{BASE_URL}/api/v1/dashboard/metrics", headers=headers)
    print(f"GET /api/v1/dashboard/metrics - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.text}")
    print()
    
    # Test user statistics endpoint
    response = requests.get(f"{BASE_URL}/api/v1/dashboard/user-stats", headers=headers)
    print(f"GET /api/v1/dashboard/user-stats - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.text}")
    print()

def test_unauthorized_access():
    """Test unauthorized access scenarios"""
    print("=== Testing Unauthorized Access ===")
    
    # Test without token
    response = requests.post(f"{BASE_URL}/api/v1/auth/check-permission")
    print(f"POST /api/v1/auth/check-permission (no token) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    # Test with invalid token
    headers = {"Authorization": "Bearer invalid-token"}
    response = requests.post(f"{BASE_URL}/api/v1/auth/check-permission", headers=headers)
    print(f"POST /api/v1/auth/check-permission (invalid token) - Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_rate_limiting():
    """Test rate limiting"""
    print("=== Testing Rate Limiting ===")
    
    token = create_test_token(user_id=1)
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Making multiple requests to test rate limiting...")
    for i in range(12):  # Exceed the default limit of 10
        response = requests.get(f"{BASE_URL}/api/v1/auth/validate-token", headers=headers)
        print(f"Request {i+1} - Status: {response.status_code}")
        if response.status_code == 429:
            print(f"Rate limited! Response: {response.json()}")
            break
    print()

def main():
    """Run all tests"""
    print("Temple Management System API Test Script")
    print("=" * 50)
    
    try:
        test_health_check()
        test_authentication_endpoints()
        test_dashboard_endpoints()
        test_unauthorized_access()
        test_rate_limiting()
        
        print("=== Test Summary ===")
        print("All tests completed!")
        print("\nTo create your own tokens, use:")
        print("from app.core.security import create_access_token")
        print("token = create_access_token(subject='user_id')")
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to the API server.")
        print("Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    main() 