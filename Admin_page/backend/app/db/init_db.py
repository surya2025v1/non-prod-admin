from sqlalchemy import create_engine
from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.website import Website
from app.core.config import settings

def init_db():
    """Initialize database by creating all tables"""
    # Import all models to ensure they are registered with Base
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db() 