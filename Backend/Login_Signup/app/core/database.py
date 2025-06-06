from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create SQLAlchemy engine with security configurations
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Enable pessimistic disconnect handling
    pool_recycle=300,    # Recycle connections every 5 minutes
    pool_size=5,         # Number of connections to maintain
    max_overflow=10,     # Additional connections on high load
    echo=settings.ENVIRONMENT == "development",  # SQL logging in development
    connect_args={
        "charset": "utf8mb4",  # Support for emojis and special characters
        "autocommit": False,   # Explicit transaction control
    }
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.
    This function will be used as a dependency in FastAPI routes.
    
    Yields:
        Database session
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize database tables.
    This function should be called when starting the application.
    """
    try:
        # Import all models here to ensure they are registered with SQLAlchemy
        from app.models import user  # noqa
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise


def check_db_connection() -> bool:
    """
    Check if database connection is working.
    
    Returns:
        True if connection is successful, False otherwise
    """
    try:
        with engine.connect() as connection:
            # Use text() to wrap the SQL query for SQLAlchemy 2.0 compatibility
            result = connection.execute(text("SELECT 1"))
            result.fetchone()
        logger.info("Database connection successful")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False


def close_db_connections():
    """
    Close all database connections.
    Useful for cleanup during application shutdown.
    """
    try:
        engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database connections: {e}") 