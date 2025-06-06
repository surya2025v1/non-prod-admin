from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.core.database import get_db
from app.api.deps import require_admin_or_editor
from app.models.user import User
from app.crud.user import get_users, get_active_admins_and_editors
from app.middleware.rate_limit import api_rate_limit
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/metrics", response_model=Dict[str, Any])
@api_rate_limit
async def get_dashboard_metrics(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_editor)
):
    """
    Get dashboard metrics for admin/editor users.
    
    This endpoint returns various metrics for the dashboard including:
    - User statistics
    - System information
    - Activity metrics (placeholder for future implementation)
    
    Headers:
        Authorization: Bearer <jwt_token>
    
    Returns:
        Dictionary containing dashboard metrics
        
    Raises:
        401: Invalid or missing token
        403: User doesn't have Admin/Editor permissions
        429: Rate limit exceeded
    """
    try:
        # Get user statistics
        all_users = get_users(db, skip=0, limit=1000)
        active_users = get_users(db, skip=0, limit=1000, is_active=True)
        admin_editor_users = get_active_admins_and_editors(db)
        
        # Count users by role
        admin_count = len([u for u in admin_editor_users if u.role.value == "Admin"])
        editor_count = len([u for u in admin_editor_users if u.role.value == "Editor"])
        member_count = len([u for u in all_users if u.role.value == "Member"])
        
        metrics = {
            "user_statistics": {
                "total_users": len(all_users),
                "active_users": len(active_users),
                "inactive_users": len(all_users) - len(active_users),
                "admin_users": admin_count,
                "editor_users": editor_count,
                "member_users": member_count
            },
            "dashboard_cards": {
                "slider_images": 4,  # Placeholder - will be updated when metrics tables are added
                "service_cards": 3,  # Placeholder
                "info_cards": 3,     # Placeholder
                "active_users": len(active_users)
            },
            "system_status": {
                "database": "online",
                "api_status": "healthy",
                "last_updated": "2025-01-01T00:00:00Z"  # This will be dynamic
            },
            "recent_activity": {
                "total_activities": 0,  # Placeholder for future activity tracking
                "activities_today": 0,
                "last_login_count": 0
            },
            "permissions": {
                "current_user": current_user.username,
                "current_role": current_user.role.value,
                "access_level": "admin" if current_user.is_admin() else "editor"
            }
        }
        
        logger.info(f"Dashboard metrics retrieved by {current_user.username}")
        return metrics
        
    except Exception as e:
        logger.error(f"Error retrieving dashboard metrics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving dashboard metrics"
        )


@router.get("/user-stats")
@api_rate_limit
async def get_user_statistics(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_editor)
):
    """
    Get detailed user statistics.
    
    Headers:
        Authorization: Bearer <jwt_token>
    
    Returns:
        Detailed user statistics
        
    Raises:
        401: Invalid or missing token
        403: User doesn't have Admin/Editor permissions
        429: Rate limit exceeded
    """
    try:
        users = get_users(db, skip=0, limit=1000)
        
        stats = {
            "total_count": len(users),
            "active_count": len([u for u in users if u.is_active]),
            "inactive_count": len([u for u in users if not u.is_active]),
            "by_role": {
                "admin": len([u for u in users if u.role.value == "Admin"]),
                "editor": len([u for u in users if u.role.value == "Editor"]),
                "member": len([u for u in users if u.role.value == "Member"])
            },
            "active_by_role": {
                "admin": len([u for u in users if u.role.value == "Admin" and u.is_active]),
                "editor": len([u for u in users if u.role.value == "Editor" and u.is_active]),
                "member": len([u for u in users if u.role.value == "Member" and u.is_active])
            }
        }
        
        logger.info(f"User statistics retrieved by {current_user.username}")
        return stats
        
    except Exception as e:
        logger.error(f"Error retrieving user statistics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving user statistics"
        )


@router.get("/health")
async def health_check():
    """
    Public health check endpoint.
    
    Returns:
        System health status
    """
    return {
        "status": "healthy",
        "service": "Temple Management System API",
        "version": "1.0.0"
    } 