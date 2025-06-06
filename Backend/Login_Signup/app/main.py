from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import logging
import time
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db, check_db_connection, close_db_connections
from app.api.v1.auth import router as auth_router, limiter

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# Rate limit exception handler function
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """
    Handle rate limit exceeded exceptions.
    """
    client_ip = get_remote_address(request)
    logger.warning(f"Rate limit exceeded for IP: {client_ip} - {exc.detail}")
    
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "detail": f"Rate limit exceeded: {exc.detail}",
            "error_code": "RATE_LIMIT_EXCEEDED"
        },
        headers={"Retry-After": "60"}
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("Starting Temple Management Login/Signup Service...")
    
    try:
        # Check database connection
        if not check_db_connection():
            logger.error("Database connection failed")
            raise Exception("Database connection failed")
        
        # Initialize database tables
        init_db()
        logger.info("Database initialized successfully")
        
        logger.info(f"Service started successfully on {settings.ENVIRONMENT} environment")
        logger.info(f"Database: {settings.DATABASE_NAME}")
        
    except Exception as e:
        logger.error(f"Failed to start service: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Temple Management Login/Signup Service...")
    close_db_connections()
    logger.info("Service shutdown complete")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="""
    ## Temple Management System - Authentication Service
    
    Secure login and signup API for Temple Management System.
    
    ### Features:
    - 🔐 **Secure Authentication**: JWT tokens with configurable expiration
    - 🛡️ **Rate Limiting**: Protection against brute force attacks
    - 🔒 **Account Security**: Automatic lockout after failed attempts
    - 📝 **User Registration**: Secure account creation with email validation
    - 🏠 **Health Monitoring**: Built-in health check endpoints
    - 📊 **Comprehensive Logging**: Full audit trail of authentication events
    
    ### Security Standards:
    - Password hashing with bcrypt (12 rounds)
    - Input sanitization and validation
    - CORS protection with specific origins
    - Trusted host middleware
    - Rate limiting with Redis backend
    - SQL injection prevention with ORM
    
    ### API Endpoints:
    - `POST /api/v1/auth/login` - Authenticate user
    - `POST /api/v1/auth/signup` - Register new user
    - `POST /api/v1/auth/validate-token` - Validate JWT token
    - `GET /api/v1/auth/health` - Health check
    """,
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
    debug=settings.ENVIRONMENT == "development"
)

# Add Rate Limiting Middleware and Exception Handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)
app.add_middleware(SlowAPIMiddleware)

# Add Security Middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Only allow necessary methods
    allow_headers=["*"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"]
)

# Add CORS middleware to allow OPTIONS (preflight) requests from the UI (e.g. from http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust as needed (e.g. for production)
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "Accept"]
)


# Custom middleware for request logging and security headers
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    """
    Add security headers and log requests.
    """
    start_time = time.time()
    
    # Log request
    client_ip = get_remote_address(request)
    logger.info(f"Request: {request.method} {request.url.path} from IP: {client_ip}")
    
    # Process request
    response = await call_next(request)
    
    # Add security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    
    # Log response time
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"Response: {response.status_code} in {process_time:.4f}s")
    
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.
    """
    logger.error(f"Unhandled exception: {exc} for request: {request.method} {request.url}")
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "detail": "Internal server error",
            "error_code": "INTERNAL_ERROR"
        }
    )


# Include routers
app.include_router(auth_router, prefix=settings.API_V1_STR)


# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint - Basic service information.
    """
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "database": settings.DATABASE_NAME,
        "docs": "/docs" if settings.ENVIRONMENT == "development" else "disabled",
        "endpoints": {
            "login": f"{settings.API_V1_STR}/auth/login",
            "signup": f"{settings.API_V1_STR}/auth/signup",
            "health": f"{settings.API_V1_STR}/auth/health"
        }
    }


# Health check endpoint (public)
@app.get("/health")
async def health():
    """
    Public health check endpoint.
    """
    db_status = "healthy" if check_db_connection() else "unhealthy"
    
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "database_name": settings.DATABASE_NAME,
        "timestamp": time.time()
    }


# Metrics endpoint (for monitoring)
@app.get("/metrics")
async def metrics():
    """
    Basic metrics endpoint for monitoring.
    """
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "uptime": "running",
        "environment": settings.ENVIRONMENT,
        "database": settings.DATABASE_NAME
    }


if __name__ == "__main__":
    import uvicorn
    
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,  # Different port from Dashboard app
        reload=settings.ENVIRONMENT == "development",
        log_level=settings.LOG_LEVEL.lower(),
        access_log=True
    ) 