# Temple Management System - Login/Signup Service

🔐 **Secure Authentication API for Temple Management System**

A production-ready FastAPI service providing secure user authentication with login and signup functionality.

## 🚀 **Features**

- **Secure Authentication**: JWT tokens with configurable expiration
- **Rate Limiting**: Protection against brute force attacks
- **Account Security**: Automatic lockout after failed login attempts
- **User Registration**: Secure account creation with validation
- **Password Security**: bcrypt hashing with 12 rounds
- **Input Validation**: Comprehensive data validation and sanitization
- **CORS Protection**: Configurable cross-origin resource sharing
- **Health Monitoring**: Built-in health check endpoints
- **Comprehensive Logging**: Full audit trail of authentication events
- **Dynamic Configuration**: Database settings read from environment file

## 📊 **API Endpoints**

### Authentication
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/validate-token` - Token validation
- `GET /api/v1/auth/health` - Service health check

### System
- `GET /` - Service information
- `GET /health` - Public health check
- `GET /metrics` - Basic metrics

## 🛠️ **Setup Instructions**

### 1. **Environment Setup**

```bash
# Navigate to Login_Signup directory
cd Backend/Login_Signup

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

### 2. **Database Configuration**

Ensure your MySQL database is running and the database specified in your `env` file exists.

The system will automatically read database configuration from the `env` file:
- `DATABASE_NAME` - Your database name
- `DATABASE_HOST` - Database host (default: localhost)
- `DATABASE_PORT` - Database port (default: 3306)
- `DATABASE_USER` - Database username
- `DATABASE_PASSWORD` - Database password

### 3. **Environment Variables**

Copy the environment template and configure:
```bash
cp env.example .env
```

Edit `.env` file with your settings:
```bash
# Database Configuration
DATABASE_NAME=your_database_name       # e.g., svtemple_2
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password

# Security Configuration
SECRET_KEY=your-secret-key-here  # Generate with: openssl rand -hex 32
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Rate Limiting
RATE_LIMIT_REQUESTS=5
SIGNUP_RATE_LIMIT=3
```

### 4. **Database Migration**

Run the dynamic migration script that reads your database configuration:

```bash
# Run Python migration script (recommended)
python migrate_users_table.py

# Or run SQL migration manually (if preferred)
mysql -u root -p < migrate_users_table.sql
```

The Python migration script will:
- ✅ Read database settings from your `env` file
- ✅ Connect to your configured database
- ✅ Safely add new columns (only if they don't exist)
- ✅ Update existing users with default names
- ✅ Add performance indexes
- ✅ Show table structure and statistics

### 5. **Run the Application**

```bash
# Development mode (with auto-reload)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload

# Or run directly
python app/main.py
```

### 6. **Access the Application**

- **API Documentation**: http://localhost:8002/docs
- **Health Check**: http://localhost:8002/health
- **Service Info**: http://localhost:8002/

## 📝 **API Usage Examples**

### User Signup
```bash
curl -X POST "http://localhost:8002/api/v1/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{
       "first_name": "John",
       "last_name": "Doe",
       "email": "john.doe@example.com",
       "password": "secure_password123"
     }'
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user_id": 123
}
```

### User Login
```bash
curl -X POST "http://localhost:8002/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "userid": "john.doe@example.com",
       "password": "secure_password123"
     }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": 123,
    "username": "john.doe@example.com",
    "role": "User"
  }
}
```

## 🔒 **Security Features**

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with 12 rounds
- **Account Lockout**: 5 failed attempts = 15-minute lockout
- **Token Expiration**: Configurable (default: 30 minutes)

### API Security
- **Rate Limiting**: 5 login attempts per minute, 3 signups per minute
- **Input Sanitization**: Protection against injection attacks
- **CORS Protection**: Specific origin allowlist
- **Security Headers**: Comprehensive security headers
- **Request Logging**: Full audit trail

### Network Security
- **Trusted Hosts**: Host validation middleware
- **HTTPS Ready**: Production-ready SSL/TLS support
- **Port Isolation**: Runs on port 8002 (separate from dashboard)

## 🗄️ **Database Schema**

### Users Table (Extended)
The migration script will add these columns to your existing users table:

```sql
-- Basic user information
first_name VARCHAR(50) NOT NULL
last_name VARCHAR(50) NOT NULL

-- Timestamps
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
last_login DATETIME NULL

-- Security fields for login attempt tracking
failed_login_attempts INT DEFAULT 0 NOT NULL
locked_until DATETIME NULL
last_failed_login DATETIME NULL
password_changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
email_verified BOOLEAN DEFAULT FALSE NOT NULL

-- Performance indexes
INDEX idx_users_email (email)
INDEX idx_users_username (username)
INDEX idx_users_active (is_active)
```

## ⚙️ **Configuration Options**

### Database Settings (from env file)
```bash
DATABASE_NAME=your_database_name    # Your database name
DATABASE_HOST=localhost             # Database host
DATABASE_PORT=3306                  # Database port
DATABASE_USER=root                  # Database username
DATABASE_PASSWORD=your_password     # Database password
```

### Token Settings
```bash
ACCESS_TOKEN_EXPIRE_MINUTES=30  # Token expiration (configurable)
SECRET_KEY=your-secret-key      # JWT signing key
ALGORITHM=HS256                 # JWT algorithm
```

### Rate Limiting
```bash
RATE_LIMIT_REQUESTS=5      # Login attempts per minute
SIGNUP_RATE_LIMIT=3        # Signup attempts per minute
RATE_LIMIT_WINDOW=60       # Time window in seconds
```

### Account Security
```bash
MAX_LOGIN_ATTEMPTS=5       # Failed attempts before lockout
LOCKOUT_DURATION_MINUTES=15 # Account lockout duration
```

## 📊 **Monitoring & Logging**

### Health Checks
- **Database connectivity**
- **Service status**
- **Environment information**
- **Database name and configuration**

### Logging Events
- User registration attempts
- Login attempts (success/failure)
- Account lockouts
- Rate limit violations
- Security events
- Database migration activities

### Metrics
- Request/response times
- Error rates
- Authentication success rates

## 🔧 **Development & Testing**

### Running the Migration
```bash
# Run the Python migration script
python migrate_users_table.py

# The script will show:
# - Database connection status
# - Table structure before/after
# - Sample user data
# - Migration statistics
```

### Running Tests
```bash
# Install test dependencies (already in requirements.txt)
pip install pytest pytest-asyncio httpx

# Run API tests
python test_auth_api.py

# Run unit tests (if available)
pytest tests/
```

### Development Mode
```bash
# Enable debug mode and API docs
ENVIRONMENT=development
python app/main.py
```

## 🚀 **Production Deployment**

### Environment Variables for Production
```bash
ENVIRONMENT=production
SECRET_KEY=generate-strong-secret-key
DATABASE_NAME=your_production_database
DATABASE_HOST=your-db-host
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-secure-password
CORS_ORIGINS=["https://yourdomain.com"]
ALLOWED_HOSTS=["yourdomain.com", "api.yourdomain.com"]
```

### Security Checklist
- [ ] Change default SECRET_KEY
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up database with restricted user
- [ ] Enable Redis for rate limiting
- [ ] Configure proper logging
- [ ] Set up monitoring and alerts
- [ ] Run migration on production database

## 📞 **Support**

For issues or questions regarding the Login/Signup service:
1. Check the logs for error details
2. Verify database connectivity with the migration script
3. Ensure all environment variables are set in the `env` file
4. Check rate limiting settings
5. Run the migration script to verify database schema

## 🔄 **Integration with Dashboard**

This service is designed to work with the Temple Management Dashboard app. The Dashboard app can validate tokens using the `/api/v1/auth/validate-token` endpoint or by implementing local JWT validation for better performance.

## 📈 **Performance Notes**

- JWT tokens should be validated locally in production for performance
- Use Redis for rate limiting in production environments
- Consider implementing token refresh mechanism for longer sessions
- Monitor authentication patterns for security anomalies
- The migration script only adds missing columns, making it safe to run multiple times 