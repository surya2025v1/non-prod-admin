from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import logging

from app.db.session import get_db
from app.api.deps import get_current_user
from app.core.security import TokenData
from app.models.website import Website
from app.models.user import User
from app.db.client_db_manager import client_db_manager

logger = logging.getLogger(__name__)

router = APIRouter()

class GetMyUsersResponse:
    """Response model for get_my_users endpoint"""
    def __init__(self, status: str, message: str, data: Optional[Dict[str, Any]] = None):
        self.status = status
        self.message = message
        self.data = data or {}

@router.get("/get_my_users")
async def get_my_users(
    domain: str = Query(..., description="Domain name to get users for"),
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get users from a specific domain database for the authenticated user.
    
    This endpoint:
    1. Gets user ID from bearer token
    2. Validates that the domain belongs to the authenticated user with status 'published'
    3. Checks if database {domain}_{owner_id} exists
    4. If database exists, returns all user records from the users table (excluding sensitive data)
    5. If database doesn't exist, returns empty response
    """
    
    try:
        # Step 1: Get user information from token (using username to get user ID)
        user = db.query(User).filter(User.username == current_user.username).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Step 2: Get website by domain name and validate ownership and status
        website = db.query(Website).filter(
            Website.owner_id == user.id,
            Website.domain == domain,
            Website.status == 'published'
        ).first()
        
        if not website:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Website not found with the specified domain, or you don't have access to it, or status is not published"
            )
        
        owner_id = website.owner_id
        
        logger.info(f"Checking database for domain: {domain} with owner: {owner_id} (website_id: {website.id})")
        
        # Step 3: Check if database exists
        db_exists = client_db_manager.database_exists(domain, owner_id)
        
        if not db_exists:
            logger.info(f"Database {domain}_{owner_id} does not exist, returning empty response")
            return GetMyUsersResponse(
                status="success",
                message=f"Database for domain {domain} does not exist",
                data={"users": []}
            ).__dict__
        
        # Step 4: Check if users table exists in the database
        users_table_exists = client_db_manager.table_exists(domain, "users", owner_id)
        
        if not users_table_exists:
            logger.info(f"Users table does not exist in database {domain}_{owner_id}")
            return GetMyUsersResponse(
                status="success",
                message=f"Users table not found in database for domain {domain}",
                data={"users": []}
            ).__dict__
        
        # Step 5: Get all user records from the users table
        users_data = client_db_manager.get_users_data(domain, owner_id)
        
        if users_data is None:
            logger.error(f"Failed to retrieve users data from {domain}_{owner_id}")
            return GetMyUsersResponse(
                status="success",
                message="Failed to retrieve users data",
                data={"users": []}
            ).__dict__
        
        # Step 6: Return user records
        return GetMyUsersResponse(
            status="success",
            message=f"Users retrieved from domain {domain}",
            data={
                "users": users_data,
                "website_info": {
                    "id": website.id,
                    "name": website.name,
                    "domain": website.domain,
                    "status": website.status
                }
            }
        ).__dict__
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error in get_my_users endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred while retrieving users"
        ) 