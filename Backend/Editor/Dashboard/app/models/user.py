from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    """User role enumeration"""
    ADMIN = "Admin"
    EDITOR = "Editor"
    MEMBER = "Member"


class User(Base):
    """
    User model representing the users table.
    
    Schema:
    - ID: Primary key
    - username: Unique username
    - email: Unique email address
    - role: User role (Admin, Editor, Member)
    - is_active: Boolean flag for active status
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.MEMBER)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Additional fields for better user management
    password_hash = Column(String(255), nullable=True)  # For future authentication
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}', is_active={self.is_active})>"
    
    def has_permission(self) -> bool:
        """
        Check if user has Admin or Editor permissions and is active.
        
        Returns:
            True if user is Admin/Editor and active, False otherwise
        """
        return (
            self.is_active and 
            self.role in [UserRole.ADMIN, UserRole.EDITOR]
        )
    
    def is_admin(self) -> bool:
        """Check if user is an admin"""
        return self.role == UserRole.ADMIN and self.is_active
    
    def is_editor(self) -> bool:
        """Check if user is an editor"""
        return self.role == UserRole.EDITOR and self.is_active 