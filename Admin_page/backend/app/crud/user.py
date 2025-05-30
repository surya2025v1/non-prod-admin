from sqlalchemy.orm import Session
from app.models.user import User

def get_user_by_username(db: Session, username: str) -> User:
    """Get a user by username."""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> User:
    """Get a user by email."""
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Get all users with pagination."""
    return db.query(User).offset(skip).limit(limit).all()

def authenticate_user(username: str, password: str) -> bool:
    # TODO: Implement actual authentication logic with MySQL
    # Placeholder: only allow admin/admin
    return username == "admin" and password == "admin" 