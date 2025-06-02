from fastapi import APIRouter, Depends, HTTPException, status
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

class FirstUsersResponse:
    """Response model for first_users endpoint"""
    def __init__(self, status: str, message: str, data: Optional[Dict[str, Any]] = None):
        self.status = status
        self.message = message
        self.data = data or {}

@router.get("/first_users")
async def get_first_users(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get users from the first domain database for the authenticated user.
    
    This endpoint:
    1. Gets user ID from bearer token
    2. Queries websites table for user's domains with status 'processing' or 'published'
    3. Takes the first domain and checks if database {domain}_{owner_id} exists
    4. If database doesn't exist, returns empty response
    5. If database exists, returns all user records from the users table (excluding sensitive data)
    """
    
    try:
        # Step 1: Get user information from token (using username to get user ID)
        user = db.query(User).filter(User.username == current_user.username).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Step 2: Get user's websites with processing or published status
        websites = db.query(Website).filter(
            Website.owner_id == user.id,
            Website.status.in_(['processing', 'published'])
        ).all()
        
        if not websites:
            return FirstUsersResponse(
                status="success",
                message="No websites found with 'processing' or 'published' status",
                data={"users": []}
            ).__dict__
        
        # Step 3: Get first domain
        first_website = websites[0]
        
        if not first_website.domain:
            return FirstUsersResponse(
                status="success",
                message="First website has no domain configured",
                data={"users": []}
            ).__dict__
        
        domain = first_website.domain
        owner_id = first_website.owner_id
        
        logger.info(f"Checking database for domain: {domain} with owner: {owner_id}")
        
        # Step 4: Check if database exists
        db_exists = client_db_manager.database_exists(domain, owner_id)
        
        if not db_exists:
            logger.info(f"Database {domain}_{owner_id} does not exist, returning empty response")
            return FirstUsersResponse(
                status="success",
                message=f"Database for domain {domain} does not exist",
                data={"users": []}
            ).__dict__
        
        # Step 5: Check if users table exists in the database
        users_table_exists = client_db_manager.table_exists(domain, "users", owner_id)
        
        if not users_table_exists:
            logger.info(f"Users table does not exist in database {domain}_{owner_id}")
            return FirstUsersResponse(
                status="success",
                message=f"Users table not found in database for domain {domain}",
                data={"users": []}
            ).__dict__
        
        # Step 6: Get all user records from the users table
        users_data = client_db_manager.get_users_data(domain, owner_id)
        
        if users_data is None:
            logger.error(f"Failed to retrieve users data from {domain}_{owner_id}")
            return FirstUsersResponse(
                status="success",
                message="Failed to retrieve users data",
                data={"users": []}
            ).__dict__
        
        # Step 7: Return user records
        return FirstUsersResponse(
            status="success",
            message=f"Users retrieved from domain {domain}",
            data={"users": users_data}
        ).__dict__
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error in first_users endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred while retrieving first domain users"
        ) 