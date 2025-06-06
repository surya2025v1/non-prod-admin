#!/usr/bin/env python3
"""
Test script for Temple Management Login/Signup API
This script tests all authentication endpoints to ensure they're working correctly.
"""

import requests
import json
import time
import random
import string

# Configuration
BASE_URL = "http://localhost:8002"
API_BASE = f"{BASE_URL}/api/v1"

def generate_test_user():
    """Generate a random test user for signup testing"""
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return {
        "first_name": f"Test{random_suffix}",
        "last_name": "User",
        "email": f"test{random_suffix}@example.com",
        "password": "testpassword123"
    }

def test_health_check():
    """Test health check endpoints"""
    print("\n🏥 Testing Health Check Endpoints...")
    
    try:
        # Test public health endpoint
        response = requests.get(f"{BASE_URL}/health")
        print(f"Public Health Check: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Status: {data.get('status')}")
            print(f"  Database: {data.get('database')}")
        
        # Test auth health endpoint
        response = requests.get(f"{API_BASE}/auth/health")
        print(f"Auth Health Check: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Status: {data.get('status')}")
            print(f"  Service: {data.get('service')}")
        
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_signup(user_data):
    """Test user signup endpoint"""
    print(f"\n📝 Testing User Signup for {user_data['email']}...")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Signup Response: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200:
            print("✅ Signup successful!")
            return data.get('user_id')
        else:
            print(f"❌ Signup failed: {data.get('detail')}")
            return None
            
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return None

def test_login(email, password):
    """Test user login endpoint"""
    print(f"\n🔐 Testing User Login for {email}...")
    
    try:
        login_data = {
            "userid": email,
            "password": password
        }
        
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Login Response: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print("✅ Login successful!")
            print(f"  Token Type: {data.get('token_type')}")
            print(f"  Expires In: {data.get('expires_in')} seconds")
            print(f"  User ID: {data.get('user', {}).get('id')}")
            print(f"  Username: {data.get('user', {}).get('username')}")
            print(f"  Role: {data.get('user', {}).get('role')}")
            return data.get('access_token')
        else:
            print(f"❌ Login failed: {data.get('detail')}")
            return None
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_token_validation(token):
    """Test token validation endpoint"""
    print("\n🎫 Testing Token Validation...")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/validate-token",
            json={"token": token},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Token Validation Response: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200 and data.get('valid'):
            print("✅ Token validation successful!")
            return True
        else:
            print(f"❌ Token validation failed: {data.get('message')}")
            return False
            
    except Exception as e:
        print(f"❌ Token validation error: {e}")
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\n🚫 Testing Invalid Login...")
    
    try:
        login_data = {
            "userid": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Invalid Login Response: {response.status_code}")
        if response.status_code == 401:
            print("✅ Invalid login properly rejected!")
            return True
        else:
            print("❌ Invalid login should return 401")
            return False
            
    except Exception as e:
        print(f"❌ Invalid login test error: {e}")
        return False

def test_duplicate_signup(user_data):
    """Test signup with duplicate email"""
    print(f"\n🔄 Testing Duplicate Signup for {user_data['email']}...")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Duplicate Signup Response: {response.status_code}")
        if response.status_code == 409:
            print("✅ Duplicate signup properly rejected!")
            return True
        else:
            print("❌ Duplicate signup should return 409")
            return False
            
    except Exception as e:
        print(f"❌ Duplicate signup test error: {e}")
        return False

def test_rate_limiting():
    """Test rate limiting functionality"""
    print("\n⏱️ Testing Rate Limiting...")
    
    try:
        # Make multiple requests to trigger rate limit
        user_data = generate_test_user()
        
        for i in range(7):  # Should hit rate limit after 5 attempts
            response = requests.post(
                f"{API_BASE}/auth/login",
                json={"userid": "test@example.com", "password": "wrong"},
                headers={"Content-Type": "application/json"}
            )
            print(f"  Attempt {i+1}: {response.status_code}")
            
            if response.status_code == 429:
                print("✅ Rate limiting is working!")
                return True
            
            time.sleep(0.1)  # Small delay between requests
        
        print("⚠️ Rate limiting may not be configured properly")
        return False
        
    except Exception as e:
        print(f"❌ Rate limiting test error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Starting Temple Management Login/Signup API Tests")
    print("=" * 60)
    
    # Check if service is running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print("❌ Service is not running. Please start the application first.")
            print("Run: cd Backend/Login_Signup && python app/main.py")
            return
    except requests.exceptions.RequestException:
        print("❌ Cannot connect to the service. Please ensure it's running on port 8002.")
        print("Run: cd Backend/Login_Signup && python app/main.py")
        return
    
    # Test results tracking
    test_results = []
    
    # Run tests
    test_results.append(("Health Check", test_health_check()))
    
    # Generate test user
    test_user = generate_test_user()
    print(f"\n🧪 Generated test user: {test_user['email']}")
    
    # Test signup
    user_id = test_signup(test_user)
    test_results.append(("Signup", user_id is not None))
    
    if user_id:
        # Test login
        token = test_login(test_user['email'], test_user['password'])
        test_results.append(("Login", token is not None))
        
        if token:
            # Test token validation
            test_results.append(("Token Validation", test_token_validation(token)))
        
        # Test duplicate signup
        test_results.append(("Duplicate Signup Rejection", test_duplicate_signup(test_user)))
    
    # Test invalid login
    test_results.append(("Invalid Login Rejection", test_invalid_login()))
    
    # Test rate limiting (optional - may take time)
    print("\n⚠️ Rate limiting test may take some time and trigger security alerts...")
    choice = input("Do you want to test rate limiting? (y/N): ").lower().strip()
    if choice == 'y':
        test_results.append(("Rate Limiting", test_rate_limiting()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<25} {status}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! The API is working correctly.")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Please check the implementation.")
    
    print("\n💡 Tips:")
    print("- Check logs for detailed error information")
    print("- Ensure database is running and accessible")
    print("- Verify environment variables are set correctly")
    print("- Check Redis connection for rate limiting")

if __name__ == "__main__":
    main() 