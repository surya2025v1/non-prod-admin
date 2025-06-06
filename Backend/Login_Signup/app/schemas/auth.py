from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


class LoginRequest(BaseModel):
    """Schema for login request"""
    userid: str  # Can be username or email
    password: str
    
    @field_validator('userid')
    @classmethod
    def validate_userid(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('User ID is required')
        return v.strip()
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Password is required')
        return v


class LoginResponse(BaseModel):
    """Schema for successful login response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # Token expiration in seconds
    user: dict


class SignupRequest(BaseModel):
    """Schema for signup request"""
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    
    @field_validator('first_name')
    @classmethod
    def validate_first_name(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('First name is required')
        if len(v.strip()) > 50:
            raise ValueError('First name too long (max 50 characters)')
        return v.strip()
    
    @field_validator('last_name')
    @classmethod
    def validate_last_name(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Last name is required')
        if len(v.strip()) > 50:
            raise ValueError('Last name too long (max 50 characters)')
        return v.strip()
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Password is required')
        # Basic validation - UI handles complex validation
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v


class SignupResponse(BaseModel):
    """Schema for successful signup response"""
    success: bool = True
    message: str
    user_id: int


class ErrorResponse(BaseModel):
    """Schema for error responses"""
    success: bool = False
    detail: str
    error_code: Optional[str] = None


class UserInfo(BaseModel):
    """Schema for user information in responses"""
    id: int
    first_name: str
    last_name: str
    email: str
    username: str
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TokenValidationResponse(BaseModel):
    """Schema for token validation responses"""
    valid: bool
    user_id: Optional[int] = None
    username: Optional[str] = None
    role: Optional[str] = None
    message: str 