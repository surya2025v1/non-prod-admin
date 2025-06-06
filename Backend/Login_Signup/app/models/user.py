from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    """User role enumeration"""
    ADMIN = "Admin"
    EDITOR = "Editor"
    USER = "User"  # Changed from MEMBER to USER as per requirements
    MEMBER = "Member"  # Keep for backward compatibility


class User(Base):
    """
    Enhanced User model for Login/Signup system.
    Matches existing database schema.
    
    Schema includes:
    - ID: Primary key
    - first_name: User's first name
    - last_name: User's last name
    - username: Unique username (set to email)
    - email: Unique email address
    - password_hash: Hashed password
    - salt: Password salt (existing column, maintained for compatibility)
    - role: User role (Admin, Editor, User/Member)
    - is_active: Boolean flag for active status
    - Security tracking fields for failed login attempts
    """
    __tablename__ = "users"

    # Primary fields (matching existing database schema)
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)  # Set to email
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    salt = Column(String(255), nullable=False)  # Existing column - maintained for compatibility
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    role = Column(String(20), nullable=False, default='user')  # VARCHAR(20) as in existing schema
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)  # Using existing column name
    
    # Token fields (existing columns - maintained for future use)
    verification_token = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    
    # Timestamp fields (matching existing schema)
    last_login = Column(DateTime, nullable=True)
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    account_locked_until = Column(DateTime, nullable=True)  # Using existing column name
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp(), server_onupdate=func.current_timestamp())
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}', is_active={self.is_active})>"
    
    @property
    def full_name(self) -> str:
        """Get user's full name"""
        return f"{self.first_name} {self.last_name}".strip()
    
    @property 
    def user_role(self) -> UserRole:
        """Get user role as enum, handling string values from database"""
        role_mapping = {
            'admin': UserRole.ADMIN,
            'Admin': UserRole.ADMIN,
            'editor': UserRole.EDITOR, 
            'Editor': UserRole.EDITOR,
            'user': UserRole.USER,
            'User': UserRole.USER,
            'member': UserRole.MEMBER,
            'Member': UserRole.MEMBER
        }
        return role_mapping.get(self.role, UserRole.USER)
    
    def has_permission(self) -> bool:
        """
        Check if user has Admin or Editor permissions and is active.
        
        Returns:
            True if user is Admin/Editor and active, False otherwise
        """
        return (
            self.is_active and 
            self.user_role in [UserRole.ADMIN, UserRole.EDITOR]
        )
    
    def is_admin(self) -> bool:
        """Check if user is an admin"""
        return self.user_role == UserRole.ADMIN and self.is_active
    
    def is_editor(self) -> bool:
        """Check if user is an editor"""
        return self.user_role == UserRole.EDITOR and self.is_active
    
    def is_user(self) -> bool:
        """Check if user is a regular user"""
        return self.user_role in [UserRole.USER, UserRole.MEMBER] and self.is_active
    
    def is_account_locked(self) -> bool:
        """
        Check if account is currently locked due to failed login attempts.
        
        Returns:
            True if account is locked, False otherwise
        """
        if not self.account_locked_until:  # Using existing column name
            return False
        
        from datetime import datetime
        return datetime.utcnow() < self.account_locked_until
    
    def can_attempt_login(self) -> bool:
        """
        Check if user can attempt login (not locked and active).
        
        Returns:
            True if login attempt is allowed, False otherwise
        """
        return self.is_active and not self.is_account_locked()
    
    def increment_failed_login(self):
        """Increment failed login attempts counter"""
        self.failed_login_attempts = (self.failed_login_attempts or 0) + 1
        from datetime import datetime
        self.last_failed_login = datetime.utcnow()
    
    def reset_failed_login_attempts(self):
        """Reset failed login attempts after successful login"""
        self.failed_login_attempts = 0
        self.account_locked_until = None  # Using existing column name
        from datetime import datetime
        self.last_login = datetime.utcnow()
    
    def lock_account(self, duration_minutes: int = 15):
        """
        Lock account for specified duration.
        
        Args:
            duration_minutes: Duration to lock account in minutes
        """
        from datetime import datetime, timedelta
        self.account_locked_until = datetime.utcnow() + timedelta(minutes=duration_minutes)  # Using existing column name
    
    @property
    def email_verified(self) -> bool:
        """Alias for is_verified to maintain compatibility with application logic"""
        return self.is_verified
    
    @email_verified.setter
    def email_verified(self, value: bool):
        """Setter for email_verified alias"""
        self.is_verified = value 