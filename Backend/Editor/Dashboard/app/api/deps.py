from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_token
from app.crud.user import get_user_by_id, check_user_permission
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

# Security scheme for Bearer token
security = HTTPBearer()


def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """
    Get current user from JWT token.
    
    Args:
        db: Database session
        credentials: HTTP Bearer credentials
        
    Returns:
        Current user object
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        # Extract token from credentials
        token = credentials.credentials
        
        # Verify token and get user ID
        user_id = verify_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from database
        user = get_user_by_id(db, int(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.info(f"User authenticated: {user.username} (ID: {user.id})")
        return user
        
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current active user.
    
    Args:
        current_user: Current user from JWT token
        
    Returns:
        Active user object
        
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive"
        )
    return current_user


def require_admin_or_editor(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Require user to have Admin or Editor role.
    
    Args:
        current_user: Current active user
        
    Returns:
        User with Admin or Editor role
        
    Raises:
        HTTPException: If user doesn't have required permissions
    """
    if not current_user.has_permission():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin or Editor role required."
        )
    
    logger.info(f"Permission granted to {current_user.username} (Role: {current_user.role})")
    return current_user


def require_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Require user to have Admin role.
    
    Args:
        current_user: Current active user
        
    Returns:
        User with Admin role
        
    Raises:
        HTTPException: If user doesn't have admin permissions
    """
    if not current_user.is_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required"
        )
    
    logger.info(f"Admin access granted to {current_user.username}")
    return current_user


def optional_auth(
    db: Session = Depends(get_db),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[User]:
    """
    Optional authentication - returns user if token is provided and valid, None otherwise.
    
    Args:
        db: Database session
        credentials: Optional HTTP Bearer credentials
        
    Returns:
        User object if authenticated, None otherwise
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        user_id = verify_token(token)
        
        if user_id:
            user = get_user_by_id(db, int(user_id))
            if user and user.is_active:
                return user
    except Exception:
        # Silently fail for optional auth
        pass
    
    return None


def check_permission_dependency(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Check if current user has permission (Admin or Editor role and is active).
    This is the main permission check dependency for protected endpoints.
    
    Args:
        db: Database session
        current_user: Current user from token
        
    Returns:
        User with valid permissions
        
    Raises:
        HTTPException: If user doesn't have required permissions
    """
    # Double-check permissions in database
    user_with_permission = check_user_permission(db, current_user.id)
    
    if not user_with_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin or Editor role with active status required."
        )
    
    return user_with_permission 