from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import check_permission_dependency, get_current_user
from app.schemas.auth import PermissionResponse, AuthStatus
from app.models.user import User
from app.middleware.rate_limit import auth_rate_limit
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/check-permission", response_model=PermissionResponse)
@auth_rate_limit
async def check_permission(
    request: Request,
    user: User = Depends(check_permission_dependency)
):
    """
    Check user permissions based on Bearer token.
    
    This endpoint validates the JWT token and checks if the user has Admin or Editor role
    and is active before allowing access to protected resources.
    
    Headers:
        Authorization: Bearer <jwt_token>
    
    Returns:
        PermissionResponse with user details and permission status
        
    Raises:
        401: Invalid or missing token
        403: User doesn't have required permissions
        429: Rate limit exceeded
    """
    try:
        response = PermissionResponse(
            success=True,
            user_id=user.id,
            username=user.username,
            role=user.role,
            is_active=user.is_active,
            has_permission=user.has_permission(),
            message=f"Permission granted for {user.role.value} user: {user.username}"
        )
        
        logger.info(f"Permission check successful for user {user.username} (ID: {user.id})")
        return response
        
    except Exception as e:
        logger.error(f"Permission check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during permission check"
        )


@router.get("/status", response_model=AuthStatus)
@auth_rate_limit
async def auth_status(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Get authentication status of current user.
    
    Headers:
        Authorization: Bearer <jwt_token>
    
    Returns:
        AuthStatus with authentication details
        
    Raises:
        401: Invalid or missing token
        429: Rate limit exceeded
    """
    try:
        return AuthStatus(
            authenticated=True,
            user_id=current_user.id,
            role=current_user.role,
            message=f"User {current_user.username} is authenticated with {current_user.role.value} role"
        )
    except Exception as e:
        logger.error(f"Auth status check failed: {str(e)}")
        return AuthStatus(
            authenticated=False,
            message="Authentication failed"
        )


@router.get("/validate-token")
@auth_rate_limit
async def validate_token(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Simple token validation endpoint.
    
    Headers:
        Authorization: Bearer <jwt_token>
    
    Returns:
        Simple validation response
        
    Raises:
        401: Invalid or missing token
        429: Rate limit exceeded
    """
    return {
        "valid": True,
        "user_id": current_user.id,
        "username": current_user.username,
        "message": "Token is valid"
    } 