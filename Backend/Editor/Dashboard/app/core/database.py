from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create SQLAlchemy engine
# Connection pool settings for production use
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Enable pessimistic disconnect handling
    pool_recycle=300,    # Recycle connections every 5 minutes
    pool_size=5,         # Number of connections to maintain
    max_overflow=10,     # Additional connections on high load
    echo=settings.ENVIRONMENT == "development"  # SQL logging in development
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
            connection.execute("SELECT 1")
        logger.info("Database connection successful")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False 