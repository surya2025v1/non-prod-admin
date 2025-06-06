# Admin Page Backend API

FastAPI backend application for the Admin Page project with authentication, website management, and user management features.

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps
1. **Clone and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - phpMyAdmin: http://localhost:8080 (optional database management)

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

---

## 🛠️ Manual Local Setup

### Prerequisites
- Python 3.11+ (recommended) or Python 3.10
- MySQL server running locally
- Git

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
# Upgrade pip
pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt
```

### Step 4: Configure Database
1. **Ensure MySQL is running** on your local machine
2. **Update database credentials** in `app/core/config.py` if needed:
   ```python
   MYSQL_USER: str = "root"
   MYSQL_PASSWORD: str = "your_password"
   MYSQL_HOST: str = "localhost"
   MYSQL_PORT: int = 3306
   MYSQL_DB: str = "admin_page_db"
   ```

3. **Create the database** (if it doesn't exist):
   ```sql
   CREATE DATABASE admin_page_db;
   ```

### Step 5: Run the Application
```bash
# Make sure you're in the backend directory and virtual environment is activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 6: Access the Application
- **API Base URL:** http://localhost:8000
- **Interactive API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/v1/health

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── login.py          # Authentication endpoints
│   │       ├── website.py        # Website management
│   │       ├── manage_user.py    # User management
│   │       └── ...
│   ├── core/
│   │   ├── config.py            # Configuration settings
│   │   └── security.py          # JWT and password handling
│   ├── crud/                    # Database operations
│   ├── db/                      # Database configuration
│   ├── models/                  # SQLAlchemy models
│   └── main.py                  # FastAPI application
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Docker configuration
├── docker-compose.yml          # Multi-container setup
└── README.md                    # This file
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/login` - User login
- `GET /api/v1/me` - Get current user info
- `PATCH /api/v1/me` - Update current user

### Website Management
- `GET /api/v1/my_website` - Get user's websites
- `POST /api/v1/my_website` - Create/update website
- `POST /api/v1/delete_mysite` - Delete website

### User Management
- `POST /api/v1/add_user` - Add new user
- `POST /api/v1/modify_user` - Modify existing user
- `POST /api/v1/delete_user` - Delete user
- `GET /api/v1/get_roles` - Get available roles

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Port 8000 Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process (replace PID with actual process ID)
kill <PID>
```

#### 2. Virtual Environment Not Found
```bash
# Make sure you're in the backend directory
pwd  # Should show: .../Admin_page/backend

# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
```

#### 3. Module Import Errors
```bash
# Ensure you're in the virtual environment
which python  # Should show: .../venv/bin/python

# Reinstall dependencies
pip install -r requirements.txt
```

#### 4. Database Connection Errors
- Verify MySQL is running: `brew services list | grep mysql` (macOS)
- Check database credentials in `app/core/config.py`
- Ensure database `admin_page_db` exists

#### 5. Python Version Compatibility
- Use Python 3.11 for best compatibility
- Avoid Python 3.13 (has SQLAlchemy compatibility issues)

---

## 🔑 Environment Variables

You can set these environment variables or update `app/core/config.py`:

```bash
export MYSQL_USER="root"
export MYSQL_PASSWORD="your_password"
export MYSQL_HOST="localhost"
export MYSQL_PORT="3306"
export MYSQL_DB="admin_page_db"
```

---

## 📝 Development Notes

### Key Dependencies
- **FastAPI 0.109.2** - Web framework
- **SQLAlchemy 2.0.41** - Database ORM
- **PyMySQL 1.1.0** - MySQL driver
- **Pydantic 2.8+** - Data validation
- **python-jose** - JWT handling
- **passlib** - Password hashing

### Recent Fixes Applied
- ✅ Fixed 422 validation errors by making `id` optional in `WebsiteRequest`
- ✅ Resolved SQLAlchemy Python 3.13 compatibility issues
- ✅ Added missing `pydantic-settings` dependency
- ✅ Corrected OAuth2 form data handling for login endpoint

---

## 🚢 Production Deployment

For production deployment:

1. **Update security settings:**
   - Change `SECRET_KEY` in `app/core/security.py`
   - Update `CORS_ORIGINS` in `app/core/config.py`

2. **Use environment variables:**
   - Set database credentials via environment variables
   - Use a production database (not localhost)

3. **Docker production build:**
   ```bash
   # Remove development volume mounts from docker-compose.yml
   docker-compose -f docker-compose.prod.yml up -d
   ```

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure you're following the exact steps in order
4. Check the application logs for detailed error messages 