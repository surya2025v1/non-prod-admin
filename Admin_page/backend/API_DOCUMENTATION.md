# User Management API Documentation

This document describes the user management API endpoints for retrieving users from client databases.

## Overview

The system creates separate databases for each website domain using the naming convention `{domain}_{owner_id}`. These endpoints allow retrieving user data from these client-specific databases.

## Authentication

All endpoints require bearer token authentication:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get First Domain Users

**Endpoint:** `GET /api/v1/first_users`

**Description:** Retrieves users from the first domain database for the authenticated user.

**Authentication:** Required (Bearer token)

**Parameters:** None

**Process:**
1. Gets user ID from bearer token
2. Queries websites table for user's domains with status 'processing' or 'published'
3. Takes the first domain and checks if database `{domain}_{owner_id}` exists
4. If database doesn't exist, returns empty response
5. If database exists, returns all user records from the users table (excluding sensitive data)

**Response Format:**
```json
{
  "status": "success",
  "message": "Users retrieved from domain example.com",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "full_name": "John Doe",
        "is_active": true,
        "created_at": "2024-01-01T10:00:00",
        "last_login": "2024-01-15T14:30:00"
      }
    ]
  }
}
```

**Empty Response (when database doesn't exist):**
```json
{
  "status": "success",
  "message": "Database for domain example.com does not exist",
  "data": {
    "users": []
  }
}
```

**Error Response:**
```json
{
  "detail": "User not found"
}
```

### 2. Get Users by Domain Name

**Endpoint:** `GET /api/v1/get_my_users`

**Description:** Retrieves users from a specific domain database by providing the domain name.

**Authentication:** Required (Bearer token)

**Parameters:**
- `domain` (required, query parameter): Domain name to get users for

**Process:**
1. Gets user ID from bearer token
2. Validates that the domain belongs to the authenticated user with status 'published'
3. Checks if database `{domain}_{owner_id}` exists
4. If database exists, returns all user records from the users table (excluding sensitive data)
5. If database doesn't exist, returns empty response

**Request Example:**
```
GET /api/v1/get_my_users?domain=example.com
```

**Response Format:**
```json
{
  "status": "success",
  "message": "Users retrieved from domain example.com",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "full_name": "John Doe",
        "is_active": true,
        "created_at": "2024-01-01T10:00:00",
        "last_login": "2024-01-15T14:30:00"
      }
    ],
    "website_info": {
      "id": 123,
      "name": "My Website",
      "domain": "example.com",
      "status": "published"
    }
  }
}
```

**Empty Response (when database doesn't exist):**
```json
{
  "status": "success",
  "message": "Database for domain example.com does not exist",
  "data": {
    "users": []
  }
}
```

**Error Responses:**
```json
{
  "detail": "Website not found with the specified domain, or you don't have access to it, or status is not published"
}
```

```json
{
  "detail": "User not found"
}
```

## Database Naming Convention

Client databases are named using the pattern: `{domain}_{owner_id}`

Examples:
- `example_com_123` (for domain "example.com" and owner_id 123)
- `mysite_org_456` (for domain "mysite.org" and owner_id 456)

## Security Features

### Data Exclusion
Sensitive user data is automatically excluded from responses:
- `password_hash`
- `salt`
- `reset_token`
- `verification_token`

### Access Control
- Users can only access databases for websites they own
- Website ownership is validated through the `owner_id` field
- Bearer token authentication ensures user identity
- Website status must be 'published' for the get_my_users endpoint

## Testing

### Test Scripts

**Test First Users:**
```bash
cd backend
python test_first_users.py
```

**Test Get My Users:**
```bash
cd backend
python test_get_my_users.py [domain_name]
```

### Example Usage

```python
import requests

# Login to get token
response = requests.post("http://localhost:8000/api/v1/login", data={
    "username": "admin",
    "password": "admin123"
})
token = response.json()["access_token"]

headers = {"Authorization": f"Bearer {token}"}

# Get first domain users
response = requests.get("http://localhost:8000/api/v1/first_users", headers=headers)
first_users = response.json()

# Get specific domain users
response = requests.get("http://localhost:8000/api/v1/get_my_users?domain=example.com", headers=headers)
domain_users = response.json()
```

## Notes

- Both endpoints are read-only and do not create databases or tables
- If a database or users table doesn't exist, an empty users array is returned
- Website status must be 'processing' or 'published' for first_users endpoint
- Website status must be 'published' for get_my_users endpoint
- All timestamps are returned in ISO format for JSON serialization

## How It Works

### 1. Authentication & Authorization
- Validates the bearer token to get user information
- Checks if the user owns the website or has admin privileges
- Ensures only authorized users can manage website users

### 2. Website Status Validation
- Only allows user management for websites with status `processing` or `published`
- Returns appropriate error message for invalid statuses

### 3. Database Management
- **NEW**: `first_users` endpoint uses `{domain}_{owner_id}` naming convention
- **Legacy**: Other endpoints use `client_{domain}` naming convention
- Creates the database if it doesn't exist
- Executes SQL scripts to create necessary tables

### 4. Table Creation
**NEW first_users endpoint**: Creates only the users table when needed
**Legacy endpoints**: Create all tables from the SQL file:
- **users**: Website user authentication
- **sessions**: User session management
- **user_profiles**: Additional user information
- **content**: Content management
- **contact_submissions**: Contact form data
- **newsletter_subscriptions**: Newsletter management
- **file_uploads**: File management
- **website_settings**: Website configuration
- **activity_logs**: User activity tracking
- **comments**: Comment system
- **website_analytics**: Website analytics

### 5. Security Features
- Password-related columns are excluded from API responses
- Database names are sanitized and prefixed
- Foreign key constraints maintain data integrity
- Proper indexing for performance

## Database Schema

### Users Table Structure
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Error Handling

The API uses standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters or website status)
- `401`: Unauthorized (invalid or missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (website or user not found)
- `500`: Internal Server Error

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

## API Usage Examples

### New first_users endpoint
```bash
# Get users from first domain
curl -X GET "http://localhost:8000/api/v1/first_users" \
  -H "Authorization: Bearer your_jwt_token"
```

### Legacy endpoints
```bash
# Initialize user management
curl -X POST "http://localhost:8000/api/v1/manage_user?website_id=1" \
  -H "Authorization: Bearer your_jwt_token"

# Check status
curl -X GET "http://localhost:8000/api/v1/manage_user/status?website_id=1" \
  -H "Authorization: Bearer your_jwt_token"

# Get tables info
curl -X GET "http://localhost:8000/api/v1/manage_user/tables?website_id=1" \
  -H "Authorization: Bearer your_jwt_token"
```

## Notes

1. **NEW**: `first_users` endpoint creates databases with `{domain}_{owner_id}` naming convention
2. **Legacy**: Other endpoints use `client_{domain}` naming convention for backward compatibility
3. The website must have a domain configured for user management to work
4. Database creation requires appropriate MySQL privileges
5. Password hashes and sensitive data are automatically excluded from API responses
6. The system uses MySQL with UTF8MB4 character set for full Unicode support
7. **NEW**: `first_users` endpoint only creates the users table, not all tables
8. **NEW**: `first_users` endpoint returns actual user data, not just table structure 