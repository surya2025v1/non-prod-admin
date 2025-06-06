from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime, timedelta
import logging
import secrets

from app.models.user import User, UserRole
from app.schemas.auth import SignupRequest
from app.core.security import get_password_hash, verify_password
from app.core.config import settings

logger = logging.getLogger(__name__)


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """
    Get user by ID.
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Get user by email address.
    
    Args:
        db: Database session
        email: Email address
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """
    Get user by username.
    
    Args:
        db: Database session
        username: Username
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.username == username.lower()).first()


def get_user_by_email_or_username(db: Session, identifier: str) -> Optional[User]:
    """
    Get user by email or username (for login).
    
    Args:
        db: Database session
        identifier: Email or username
        
    Returns:
        User object if found, None otherwise
    """
    identifier = identifier.lower().strip()
    return db.query(User).filter(
        or_(User.email == identifier, User.username == identifier)
    ).first()


def check_email_exists(db: Session, email: str) -> bool:
    """
    Check if email already exists in database.
    
    Args:
        db: Database session
        email: Email to check
        
    Returns:
        True if email exists, False otherwise
    """
    user = db.query(User).filter(User.email == email.lower()).first()
    return user is not None


def create_user(db: Session, signup_data: SignupRequest) -> User:
    """
    Create a new user account.
    
    Args:
        db: Database session
        signup_data: Signup request data
        
    Returns:
        Created User object
        
    Raises:
        ValueError: If email already exists
    """
    try:
        # Check if email already exists
        if check_email_exists(db, signup_data.email):
            raise ValueError("Email already registered")
        
        # Hash the password
        hashed_password = get_password_hash(signup_data.password)
        
        # Generate a salt for the existing salt column (for compatibility)
        salt = secrets.token_hex(16)
        
        # Create user object with existing database schema
        db_user = User(
            first_name=signup_data.first_name,
            last_name=signup_data.last_name,
            email=signup_data.email.lower(),
            username=signup_data.email.lower(),  # Set username to email
            password_hash=hashed_password,
            salt=salt,  # Required by existing schema
            role='User',  # Default role string for new signups (not enum)
            is_active=True,
            is_verified=False,  # Using existing column name
            failed_login_attempts=0
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"New user created: {db_user.email} (ID: {db_user.id})")
        return db_user
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise


def authenticate_user(db: Session, identifier: str, password: str) -> Optional[User]:
    """
    Authenticate user with email/username and password.
    
    Args:
        db: Database session
        identifier: Email or username
        password: Plain text password
        
    Returns:
        User object if authentication successful, None otherwise
    """
    try:
        # Get user by email or username
        user = get_user_by_email_or_username(db, identifier)
        
        if not user:
            logger.warning(f"Login attempt for non-existent user: {identifier}")
            return None
        
        # Check if account is locked
        if user.is_account_locked():
            logger.warning(f"Login attempt for locked account: {user.email}")
            return None
        
        # Check if account is active
        if not user.is_active:
            logger.warning(f"Login attempt for inactive account: {user.email}")
            return None
        
        # Verify password
        if not verify_password(password, user.password_hash):
            # Increment failed login attempts
            handle_failed_login(db, user)
            logger.warning(f"Failed login attempt for user: {user.email}")
            return None
        
        # Successful login - reset failed attempts
        handle_successful_login(db, user)
        logger.info(f"Successful login for user: {user.email}")
        return user
        
    except Exception as e:
        logger.error(f"Error during authentication: {str(e)}")
        return None


def handle_failed_login(db: Session, user: User) -> None:
    """
    Handle failed login attempt - increment counter and lock if necessary.
    
    Args:
        db: Database session
        user: User object
    """
    try:
        user.increment_failed_login()
        
        # Lock account if max attempts reached
        if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
            user.lock_account(settings.LOCKOUT_DURATION_MINUTES)
            logger.warning(f"Account locked for user: {user.email} after {user.failed_login_attempts} failed attempts")
        
        db.commit()
        
    except Exception as e:
        logger.error(f"Error handling failed login: {str(e)}")
        db.rollback()


def handle_successful_login(db: Session, user: User) -> None:
    """
    Handle successful login - reset failed attempts and update last login.
    
    Args:
        db: Database session
        user: User object
    """
    try:
        user.reset_failed_login_attempts()
        db.commit()
        
    except Exception as e:
        logger.error(f"Error handling successful login: {str(e)}")
        db.rollback()


def unlock_user_account(db: Session, user_id: int) -> bool:
    """
    Manually unlock a user account (admin function).
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        True if account was unlocked, False otherwise
    """
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            return False
        
        user.failed_login_attempts = 0
        user.account_locked_until = None  # Using existing column name
        db.commit()
        
        logger.info(f"Account unlocked for user: {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Error unlocking account: {str(e)}")
        db.rollback()
        return False


def update_user_last_login(db: Session, user_id: int) -> None:
    """
    Update user's last login timestamp.
    
    Args:
        db: Database session
        user_id: User ID
    """
    try:
        user = get_user_by_id(db, user_id)
        if user:
            user.last_login = datetime.utcnow()
            db.commit()
            
    except Exception as e:
        logger.error(f"Error updating last login: {str(e)}")
        db.rollback()


def get_user_security_info(db: Session, user_id: int) -> Optional[dict]:
    """
    Get user security information for monitoring.
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        Security info dict or None
    """
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            return None
        
        return {
            "user_id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "failed_login_attempts": user.failed_login_attempts,
            "account_locked_until": user.account_locked_until,  # Using existing column name
            "last_login": user.last_login,
            "is_verified": user.is_verified,  # Using existing column name
            "created_at": user.created_at
        }
        
    except Exception as e:
        logger.error(f"Error getting user security info: {str(e)}")
        return None 