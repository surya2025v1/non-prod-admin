from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import logging
import uvicorn
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db, check_db_connection
from app.middleware.rate_limit import setup_rate_limiting
from app.api.v1 import auth, dashboard

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("Starting Temple Management System API...")
    
    # Check database connection
    if not check_db_connection():
        logger.error("Database connection failed!")
        raise Exception("Cannot connect to database")
    
    # Initialize database tables
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
    
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Temple Management System API...")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Secure FastAPI backend for Temple Management System with JWT authentication and role-based access control",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan
)

# Security middleware - TrustedHost (for production)
# TODO: Update allowed hosts when deploying to production domain
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS  # Change from localhost to actual domain
)

# CORS middleware
# TODO: Update CORS origins when frontend domain is available
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Update with actual frontend domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Setup rate limiting
setup_rate_limiting(app)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint for basic health check"""
    return {
        "message": "Temple Management System API",
        "version": settings.PROJECT_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT
    }

@app.get("/health", tags=["Health"])
async def health():
    """Detailed health check endpoint"""
    db_status = "connected" if check_db_connection() else "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT
    }

# Include API routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["Authentication"]
)

app.include_router(
    dashboard.router,
    prefix=f"{settings.API_V1_STR}/dashboard", 
    tags=["Dashboard"]
)

# Development server startup
if __name__ == "__main__":
    logger.info("Starting development server...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Allow external connections for testing
        port=8000,
        reload=True if settings.ENVIRONMENT == "development" else False,
        log_level=settings.LOG_LEVEL.lower()
    ) 