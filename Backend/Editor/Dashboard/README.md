# Temple Management System - Backend API

A secure FastAPI backend for Temple Management System with JWT authentication, role-based access control, and comprehensive security measures for public internet deployment.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Editor, and Member roles with appropriate permissions
- **Rate Limiting**: Configurable rate limits to prevent abuse
- **Database Security**: SQL injection protection with SQLAlchemy ORM
- **CORS Security**: Configurable cross-origin resource sharing
- **Input Validation**: Pydantic schemas for request/response validation
- **Password Security**: Bcrypt hashing for password storage
- **Health Monitoring**: Built-in health check endpoints
- **Logging**: Comprehensive application logging
- **Docker Support**: Container-ready configuration

## 📁 Project Structure

```
Backend/
├── app/                        # Main application package
│   ├── __init__.py
│   ├── main.py                # FastAPI application entry point
│   ├── core/                  # Core configurations
│   │   ├── config.py         # Environment settings
│   │   ├── security.py       # JWT and password handling
│   │   └── database.py       # Database connection
│   ├── models/               # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── user.py          # User model with roles
│   ├── schemas/              # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py          # User schemas
│   │   └── auth.py          # Authentication schemas
│   ├── crud/                 # Database operations
│   │   ├── __init__.py
│   │   └── user.py          # User CRUD operations
│   ├── api/                  # API endpoints
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py      # Authentication endpoints
│   │       └── dashboard.py # Dashboard endpoints
│   └── middleware/           # Custom middleware
│       ├── __init__.py
│       └── rate_limit.py    # Rate limiting
├── Editor/                   # Editor module (future expansion)
├── Dashboard/                # Dashboard module (future expansion)
├── requirements.txt          # Python dependencies
├── env.example              # Environment variables template
└── README.md                # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- MySQL 5.7+ or 8.0+
- Redis (for rate limiting - optional)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your database and security settings
   ```

5. **Setup MySQL database**
   ```sql
   CREATE DATABASE temple_management;
   CREATE USER 'temple_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON temple_management.* TO 'temple_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

6. **Start Redis (optional, for rate limiting)**
   ```bash
   redis-server
   ```

7. **Run the application**
   ```bash
   python -m app.main
   # Or use uvicorn directly:
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

8. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## 🔧 Configuration

### Environment Variables

Configure these in your `.env` file:

#### Database Configuration
- `DATABASE_URL`: Full MySQL connection string
- `DATABASE_HOST`: MySQL host (default: localhost)
- `DATABASE_PORT`: MySQL port (default: 3306)
- `DATABASE_USER`: MySQL username
- `DATABASE_PASSWORD`: MySQL password
- `DATABASE_NAME`: Database name

#### JWT Configuration
- `SECRET_KEY`: JWT signing secret (generate a secure one!)
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

#### Security Configuration
- `ALLOWED_HOSTS`: List of allowed hosts for production
- `CORS_ORIGINS`: List of allowed CORS origins

#### Rate Limiting Configuration
**🔧 Configurable Rate Limits:**
- `RATE_LIMIT_REQUESTS`: Number of requests allowed (default: 10)
- `RATE_LIMIT_WINDOW`: Time window in seconds (default: 60)
- `REDIS_URL`: Redis connection for rate limiting

**Where to change rate limits in the future:**
1. **Environment Variables**: Modify `RATE_LIMIT_REQUESTS` and `RATE_LIMIT_WINDOW` in `.env`
2. **Code Configuration**: Update `app/middleware/rate_limit.py` for custom limits
3. **Per-endpoint**: Modify decorators in API route files

## 🔐 Security Features

### Authentication Flow
1. Client obtains JWT token from login endpoint (to be implemented)
2. Client includes token in Authorization header: `Bearer <token>`
3. API validates token and checks user permissions
4. Access granted only for Admin/Editor roles with active status

### Permission System
- **Admin**: Full access to all endpoints
- **Editor**: Access to content management and dashboard
- **Member**: Limited access (future implementation)

### Security Best Practices Implemented
- ✅ JWT token validation
- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention with ORM
- ✅ Input validation with Pydantic
- ✅ Rate limiting with configurable thresholds
- ✅ CORS configuration for frontend integration
- ✅ Trusted host middleware for production
- ✅ Comprehensive error handling
- ✅ Request/response logging

## 📚 API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/check-permission
Validates Bearer token and checks user permissions.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "user_id": 1,
  "username": "admin",
  "role": "Admin",
  "is_active": true,
  "has_permission": true,
  "message": "Permission granted for Admin user: admin"
}
```

#### GET /api/v1/auth/status
Get authentication status of current user.

#### GET /api/v1/auth/validate-token
Simple token validation endpoint.

### Dashboard Endpoints

#### GET /api/v1/dashboard/metrics
Get dashboard metrics (Admin/Editor only).

**Response:**
```json
{
  "user_statistics": {
    "total_users": 10,
    "active_users": 8,
    "admin_users": 2,
    "editor_users": 3
  },
  "dashboard_cards": {
    "slider_images": 4,
    "service_cards": 3,
    "info_cards": 3,
    "active_users": 8
  },
  "system_status": {
    "database": "online",
    "api_status": "healthy"
  }
}
```

#### GET /api/v1/dashboard/user-stats
Get detailed user statistics.

### Health Check Endpoints

#### GET /health
Detailed health check with database status.

#### GET /
Basic health check and API information.

## 🐳 Docker Deployment

### Docker Variables for Production

When deploying with Docker, configure these environment variables:

```dockerfile
ENV DATABASE_URL=mysql+pymysql://user:password@db:3306/temple_management
ENV SECRET_KEY=your-production-secret-key
ENV ENVIRONMENT=production
ENV ALLOWED_HOSTS=["yourdomain.com", "www.yourdomain.com"]
ENV CORS_ORIGINS=["https://yourdomain.com"]
ENV REDIS_URL=redis://redis:6379/0
```

### Sample docker-compose.yml

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mysql+pymysql://temple_user:password@db:3306/temple_management
      - SECRET_KEY=your-super-secret-production-key
      - ENVIRONMENT=production
    depends_on:
      - db
      - redis
  
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: temple_management
      MYSQL_USER: temple_user
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - mysql_data:/var/lib/mysql
  
  redis:
    image: redis:alpine
    
volumes:
  mysql_data:
```

## 🚨 Production Deployment Notes

### DNS and Domain Configuration

**🔧 TODO: Replace localhost with actual domain when going live**

Update these configurations for production:

1. **CORS Origins** (`app/core/config.py`):
   ```python
   CORS_ORIGINS: List[str] = ["https://yourdomain.com", "https://www.yourdomain.com"]
   ```

2. **Allowed Hosts** (`app/core/config.py`):
   ```python
   ALLOWED_HOSTS: List[str] = ["yourdomain.com", "www.yourdomain.com"]
   ```

3. **Environment Variables** (`.env` or Docker):
   ```
   CORS_ORIGINS=["https://yourdomain.com"]
   ALLOWED_HOSTS=["yourdomain.com"]
   ENVIRONMENT=production
   ```

### Security Checklist for Production

- [ ] Generate strong SECRET_KEY (use `openssl rand -hex 32`)
- [ ] Update ALLOWED_HOSTS with your domain
- [ ] Configure HTTPS/TLS termination
- [ ] Set up proper firewall rules
- [ ] Configure log rotation
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Database connection over SSL
- [ ] Remove /docs and /redoc endpoints in production

## 🧪 Testing

Run tests with pytest:
```bash
pytest
```

## 📝 Future Enhancements

- [ ] User management endpoints (CRUD)
- [ ] Login/logout endpoints with token generation
- [ ] Password reset functionality
- [ ] Activity logging and audit trails
- [ ] Advanced metrics and analytics
- [ ] File upload capabilities
- [ ] Email notifications
- [ ] API versioning
- [ ] Advanced rate limiting per user/role

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.

---

**Note**: This API is designed for secure public internet deployment with proper authentication and rate limiting. Always follow security best practices and keep dependencies updated. 