#!/usr/bin/env python3
"""
Test script for Login/Signup API endpoints.
Shows the correct way to call the API endpoints.
"""

import requests
import json
from datetime import datetime

# API Base URL
BASE_URL = "http://localhost:8002"

def test_signup():
    """Test the signup endpoint with correct format."""
    
    print("🔧 Testing Signup Endpoint")
    print("=" * 50)
    
    # Correct endpoint URL
    url = f"{BASE_URL}/api/v1/auth/signup"
    
    # Correct JSON payload (not query parameters)
    data = {
        "first_name": "Test",
        "last_name": "User",
        "email": f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
        "password": "securePassword123"
    }
    
    print(f"📍 URL: {url}")
    print(f"📦 Payload: {json.dumps(data, indent=2)}")
    
    try:
        # Make POST request with JSON body
        response = requests.post(
            url,
            json=data,  # Use json parameter, not query params
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Signup successful!")
            return data["email"]  # Return email for login test
        else:
            print("❌ Signup failed!")
            return None
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Is the server running on localhost:8002?")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_login(email=None):
    """Test the login endpoint with correct format."""
    
    print("\n🔧 Testing Login Endpoint")
    print("=" * 50)
    
    # Use provided email or existing test email
    test_email = email or "john@gmail.com"  # Use existing user from database
    
    # Correct endpoint URL
    url = f"{BASE_URL}/api/v1/auth/login"
    
    # Correct JSON payload
    data = {
        "userid": test_email,
        "password": "test123"  # Use a common test password
    }
    
    print(f"📍 URL: {url}")
    print(f"📦 Payload: {json.dumps(data, indent=2)}")
    
    try:
        # Make POST request with JSON body
        response = requests.post(
            url,
            json=data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json().get("access_token")
        else:
            print("❌ Login failed!")
            return None
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Is the server running on localhost:8002?")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_token_validation(token):
    """Test the token validation endpoint."""
    
    if not token:
        print("\n⏭️ Skipping token validation - no token available")
        return
    
    print("\n🔧 Testing Token Validation")
    print("=" * 50)
    
    url = f"{BASE_URL}/api/v1/auth/validate-token"
    
    # Send token in request body
    data = {"token": token}
    
    print(f"📍 URL: {url}")
    print(f"📦 Token: {token[:50]}...")  # Show first 50 chars
    
    try:
        response = requests.post(
            url,
            json=data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Token validation successful!")
        else:
            print("❌ Token validation failed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")


def test_health_check():
    """Test the health check endpoint."""
    
    print("\n🔧 Testing Health Check")
    print("=" * 50)
    
    url = f"{BASE_URL}/api/v1/auth/health"
    
    try:
        response = requests.get(url, timeout=5)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Health check successful!")
        else:
            print("❌ Health check failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")


def show_correct_curl_examples():
    """Show correct curl command examples."""
    
    print("\n📋 Correct API Usage Examples")
    print("=" * 50)
    
    print("✅ Correct Signup (JSON body):")
    print("""
curl -X POST "http://localhost:8002/api/v1/auth/signup" \\
     -H "Content-Type: application/json" \\
     -d '{
       "first_name": "John",
       "last_name": "Doe", 
       "email": "john.doe@example.com",
       "password": "securePassword123"
     }'
""")
    
    print("✅ Correct Login (JSON body):")
    print("""
curl -X POST "http://localhost:8002/api/v1/auth/login" \\
     -H "Content-Type: application/json" \\
     -d '{
       "userid": "john.doe@example.com",
       "password": "securePassword123"
     }'
""")
    
    print("❌ Wrong way (query parameters):")
    print("http://localhost:8002/api/v1/signup?first_name=test&email=test@gmail.com")
    print("\n❌ Wrong endpoint path:")
    print("http://localhost:8002/api/v1/signup  (missing /auth)")
    
    print("\n✅ Correct endpoint path:")
    print("http://localhost:8002/api/v1/auth/signup")


def main():
    """Main test function."""
    
    print("🧪 Temple Management Login/Signup API Test")
    print("=" * 60)
    
    # Test health check first
    test_health_check()
    
    # Test signup
    new_user_email = test_signup()
    
    # Test login with existing user
    token = test_login()
    
    # Test token validation
    test_token_validation(token)
    
    # Show correct usage examples
    show_correct_curl_examples()
    
    print("\n" + "=" * 60)
    print("🎯 Summary of Issues Found:")
    print("1. ❌ Wrong URL: Use /api/v1/auth/signup (not /api/v1/signup)")
    print("2. ❌ Wrong format: Use JSON body (not query parameters)")
    print("3. ✅ Correct method: POST request")


if __name__ == "__main__":
    main() 