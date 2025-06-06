from pydantic import BaseModel
from typing import Optional
from app.models.user import UserRole


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data schema"""
    user_id: Optional[str] = None


class PermissionRequest(BaseModel):
    """Schema for permission check request"""
    pass  # Token will be extracted from Authorization header


class PermissionResponse(BaseModel):
    """Schema for permission check response"""
    success: bool
    user_id: int
    username: str
    role: UserRole
    is_active: bool
    has_permission: bool
    message: str


class AuthStatus(BaseModel):
    """Schema for authentication status"""
    authenticated: bool
    user_id: Optional[int] = None
    role: Optional[UserRole] = None
    message: str


class LoginRequest(BaseModel):
    """Schema for login request (for future use)"""
    username: str
    password: str


class LoginResponse(BaseModel):
    """Schema for login response (for future use)"""
    access_token: str
    token_type: str = "bearer"
    user: dict
    expires_in: int 