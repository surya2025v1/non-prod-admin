from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash


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


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """
    Get user by username.
    
    Args:
        db: Database session
        username: Username
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Get user by email.
    
    Args:
        db: Database session
        email: Email address
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.email == email).first()


def get_users(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None
) -> List[User]:
    """
    Get list of users with optional filtering.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        role: Filter by role
        is_active: Filter by active status
        
    Returns:
        List of User objects
    """
    query = db.query(User)
    
    # Apply filters
    filters = []
    if role is not None:
        filters.append(User.role == role)
    if is_active is not None:
        filters.append(User.is_active == is_active)
    
    if filters:
        query = query.filter(and_(*filters))
    
    return query.offset(skip).limit(limit).all()


def get_active_admins_and_editors(db: Session) -> List[User]:
    """
    Get all active users with Admin or Editor roles.
    
    Args:
        db: Database session
        
    Returns:
        List of active Admin and Editor users
    """
    return db.query(User).filter(
        and_(
            User.is_active == True,
            User.role.in_([UserRole.ADMIN, UserRole.EDITOR])
        )
    ).all()


def create_user(db: Session, user: UserCreate) -> User:
    """
    Create a new user.
    
    Args:
        db: Database session
        user: User creation data
        
    Returns:
        Created User object
    """
    hashed_password = None
    if user.password:
        hashed_password = get_password_hash(user.password)
    
    db_user = User(
        username=user.username,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """
    Update user information.
    
    Args:
        db: Database session
        user_id: User ID to update
        user_update: Updated user data
        
    Returns:
        Updated User object if found, None otherwise
    """
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    
    # Handle password update
    if "password" in update_data and update_data["password"]:
        update_data["password_hash"] = get_password_hash(update_data["password"])
        del update_data["password"]
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    """
    Delete a user (soft delete by setting is_active to False).
    
    Args:
        db: Database session
        user_id: User ID to delete
        
    Returns:
        True if user was found and deleted, False otherwise
    """
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return False
    
    db_user.is_active = False
    db.commit()
    return True


def hard_delete_user(db: Session, user_id: int) -> bool:
    """
    Permanently delete a user from database.
    
    Args:
        db: Database session
        user_id: User ID to delete
        
    Returns:
        True if user was found and deleted, False otherwise
    """
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True


def check_user_permission(db: Session, user_id: int) -> Optional[User]:
    """
    Check if user has permission (Admin or Editor role and is active).
    
    Args:
        db: Database session
        user_id: User ID to check
        
    Returns:
        User object if has permission, None otherwise
    """
    user = get_user_by_id(db, user_id)
    if user and user.has_permission():
        return user
    return None 