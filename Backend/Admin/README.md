# Temple Management Admin API

A secure FastAPI backend for managing temple website content with role-based authentication.

## 🚀 Features

- **Bearer Token Authentication**: JWT-based secure authentication
- **Role-Based Access Control**: Admin and Editor roles with proper permissions
- **Dashboard Analytics**: Website metrics, content management, and system status
- **Content Management**: Manage website sections, services, events, and contact info
- **Activity Logging**: Track all system activities with detailed logs
- **Industry Standards**: Following FastAPI best practices and folder structure

## 📁 Project Structure

```
Backend/Admin/
├── app/
│   ├── api/
│   │   └── api_v1/
│   │       ├── endpoints/          # API endpoint modules
│   │       │   ├── auth.py         # Authentication endpoints
│   │       │   ├── dashboard.py    # Dashboard data endpoints
│   │       │   ├── content.py      # Content management
│   │       │   ├── services.py     # Temple services
│   │       │   ├── events.py       # Temple events
│   │       │   ├── contact.py      # Contact information
│   │       │   └── activity.py     # System activity logs
│   │       └── api.py              # Main API router
│   └── core/
│       ├── config.py               # App configuration
│       ├── database.py             # Database connection
│       ├── security.py             # JWT & authentication
│       └── exceptions.py           # Exception handlers
├── main.py                         # FastAPI app entry point
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

## 🛠️ Setup Instructions

### 1. Database Setup

First, create the database schema by running the SQL file manually:

```bash
# Navigate to Backend directory
cd Backend

# Execute the database schema (replace credentials as needed)
mysql -u root -p your_database_name < Edit_Website_Database.sql
```

This will create all necessary tables with sample data including:
- **Default Admin User**: `admin@temple.org` / Password: `admin123`
- **Default Editor User**: `editor@temple.org` / Password: `admin123`

### 2. Python Environment Setup

```bash
# Navigate to Admin directory
cd Backend/Admin

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the `Backend/Admin/` directory:

```env
# Database Configuration
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/temple_management
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=temple_management

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Security Configuration
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ORIGINS=http://localhost:3000,http://localhost:8080

# Environment
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 4. Run the Application

```bash
# Start the FastAPI server
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base URL**: `http://localhost:8000`
- **Interactive Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

## 🔐 Authentication

### Login Process

1. **POST** `/api/v1/auth/login`
   ```json
   {
     "email": "admin@temple.org",
     "password": "admin123"
   }
   ```

2. **Response**:
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "token_type": "bearer",
     "expires_in": 1800,
     "user": {
       "id": 1,
       "email": "admin@temple.org",
       "role": "admin",
       "full_name": "Temple Administrator"
     }
   }
   ```

3. **Use Bearer Token**: Include in all subsequent requests:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user info

### Dashboard
- `GET /api/v1/dashboard/overview` - Complete dashboard data
- `GET /api/v1/dashboard/metrics` - Website metrics only
- `GET /api/v1/dashboard/system-status` - System status only

### Content Management
- `GET /api/v1/content/sections` - Get all content sections
- `GET /api/v1/content/sections/{id}` - Get specific section
- `PUT /api/v1/content/sections/{id}` - Update section

### Services
- `GET /api/v1/services/` - Get temple services (with filters)
- `GET /api/v1/services/stats` - Service statistics

### Events
- `GET /api/v1/events/` - Get temple events (with filters)
- `GET /api/v1/events/stats` - Event statistics

### Contact
- `GET /api/v1/contact/` - Get contact information
- `GET /api/v1/contact/types` - Get contact types

### Activity
- `GET /api/v1/activity/` - Get system activity logs
- `GET /api/v1/activity/types` - Get activity types

## 🔒 Security Features

1. **JWT Bearer Token Authentication**
2. **Role-Based Access Control** (Admin/Editor only)
3. **Token Expiration & Revocation**
4. **Password Hashing** with bcrypt
5. **SQL Injection Prevention** through parameterized queries
6. **CORS Protection**
7. **Input Validation** with Pydantic

## 📈 Dashboard Data Structure

The main dashboard endpoint (`/api/v1/dashboard/overview`) returns:

```json
{
  "success": true,
  "data": {
    "website_metrics": {
      "page_views": 24580,
      "page_views_change": 15.0,
      "monthly_visitors": 3247,
      "bounce_rate": 32.4
    },
    "content_sections": [...],
    "top_pages": {...},
    "recent_activity": [...],
    "system_status": {...},
    "user_info": {...}
  }
}
```

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error_code": "HTTP_401",
  "path": "/api/v1/dashboard/overview"
}
```

## 🧪 Testing

### Test Authentication

```bash
# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@temple.org", "password": "admin123"}'

# Use token for protected endpoints
curl -X GET "http://localhost:8000/api/v1/dashboard/overview" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Troubleshooting

### Database Connection Issues
1. Verify MySQL is running
2. Check database credentials in `.env`
3. Ensure database exists and schema is created

### Authentication Issues
1. Verify user exists with Admin/Editor role
2. Check password is correct
3. Ensure token is included in Authorization header

### Permission Errors
1. Only Admin and Editor roles can access APIs
2. Check user role in database
3. Verify token is valid and not expired

## 📝 Development Notes

- **Database**: Uses raw SQL queries for performance and flexibility
- **Security**: JWT tokens are stored in database for revocation capability
- **Validation**: Pydantic models ensure proper input validation
- **Logging**: Comprehensive error logging and activity tracking
- **Performance**: Optimized queries with proper indexing

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include docstrings for all functions
4. Test all endpoints thoroughly
5. Update README if adding new features 