from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class UserBase(BaseModel):
    """Base user schema with common fields"""
    username: str
    email: str  # Changed from EmailStr to str temporarily
    role: UserRole
    is_active: bool = True


class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: Optional[str] = None
    
    @field_validator('username')
    @classmethod
    def username_must_be_valid(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if not v.isalnum():
            raise ValueError('Username must contain only alphanumeric characters')
        return v


class UserUpdate(BaseModel):
    """Schema for updating user information"""
    username: Optional[str] = None
    email: Optional[str] = None  # Changed from EmailStr to str temporarily
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserInDB(UserBase):
    """Schema for user data stored in database"""
    id: int
    password_hash: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """Schema for user data in API responses (without sensitive info)"""
    id: int
    username: str
    email: str  # Changed from EmailStr to str temporarily
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserPermissionCheck(BaseModel):
    """Schema for checking user permissions"""
    user_id: int
    username: str
    role: UserRole
    is_active: bool
    has_permission: bool
    
    class Config:
        from_attributes = True 