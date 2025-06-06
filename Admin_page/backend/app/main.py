from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.login import router as login_router
from app.api.v1.website import router as website_router
from app.api.v1.manage_user import router as manage_user_router
from app.api.v1.first_users import router as first_users_router
from app.api.v1.get_my_users import router as get_my_users_router
from app.core.config import settings
from app.db.init_db import init_db
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Admin Page API", version="1.0.0")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application...")
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")

# CORS setup: allow origins from config (currently ["*"], change in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test endpoint to verify the app is working
@app.get("/")
async def root():
    return {"message": "Admin Page API is running", "version": "1.0.0"}

# Test endpoint to verify API v1 routing
@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "message": "API v1 is working"}

# Include routers
logger.info("Including routers...")
app.include_router(login_router, prefix="/api/v1", tags=["authentication"])
app.include_router(website_router, prefix="/api/v1", tags=["websites"])
app.include_router(manage_user_router, prefix="/api/v1", tags=["user-management"])
app.include_router(first_users_router, prefix="/api/v1", tags=["first-users"])
app.include_router(get_my_users_router, prefix="/api/v1", tags=["my-users"])
logger.info("All routers included successfully") 