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

class ManageUserRequest:
    """Request model for manage user endpoint"""
    def __init__(self, website_id: int):
        self.website_id = website_id

class ManageUserResponse:
    """Response model for manage user endpoint"""
    def __init__(self, status: str, message: str, data: Optional[Dict[str, Any]] = None):
        self.status = status
        self.message = message
        self.data = data or {}

@router.post("/manage_user")
async def manage_user(
    website_id: int = Query(..., description="Website ID to manage users for"),
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Manage users for a specific website.
    
    This endpoint:
    1. Validates the user has access to the website
    2. Checks if website status is 'processing' or 'published'
    3. Creates client database if it doesn't exist
    4. Creates necessary tables in the client database
    5. Returns user table column information (excluding password hashes)
    """
    
    try:
        # Step 1: Query website and validate ownership
        website = db.query(Website).filter(Website.id == website_id).first()
        
        if not website:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Website not found"
            )
        
        # Step 2: Validate user access to website
        # Get user information from token (using username to get user ID)
        user = db.query(User).filter(User.username == current_user.username).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if user owns the website or has admin access
        if website.owner_id != user.id and user.role != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to manage users for this website"
            )
        
        # Step 3: Check website status
        if website.status not in ['processing', 'published']:
            return ManageUserResponse(
                status="error",
                message=f"Website status is '{website.status}'. User management is only available for websites with 'processing' or 'published' status.",
                data={
                    "website_id": website_id,
                    "website_name": website.name,
                    "current_status": website.status,
                    "required_status": ["processing", "published"]
                }
            ).__dict__
        
        # Step 4: Check if website has a domain
        if not website.domain:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Website domain is required for user management"
            )
        
        # Step 5: Check if database exists, create if not (using old naming convention for backward compatibility)
        domain = website.domain
        db_exists = client_db_manager.database_exists(domain)  # Old naming convention
        
        if not db_exists:
            logger.info(f"Creating database for domain: {domain}")
            if not client_db_manager.create_database(domain):  # Old naming convention
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create client database"
                )
        
        # Step 6: Create tables if they don't exist
        if not client_db_manager.table_exists(domain, "users"):  # Old naming convention
            logger.info(f"Creating tables for domain: {domain}")
            if not client_db_manager.create_tables(domain):  # Old naming convention
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create client database tables"
                )
        
        # Step 7: Get user table column information (excluding password-related columns)
        excluded_columns = ['password_hash', 'salt', 'reset_token', 'verification_token']
        columns = client_db_manager.get_table_columns(domain, "users", excluded_columns)  # Old naming convention
        
        if columns is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve user table information"
            )
        
        # Step 8: Get additional table information
        tables_info = {}
        essential_tables = ['users', 'sessions', 'user_profiles', 'website_settings']
        
        for table_name in essential_tables:
            if client_db_manager.table_exists(domain, table_name):  # Old naming convention
                table_columns = client_db_manager.get_table_columns(
                    domain, 
                    table_name, 
                    excluded_columns if table_name == 'users' else []
                )  # Old naming convention
                if table_columns:
                    tables_info[table_name] = table_columns
        
        # Step 9: Return successful response
        response_data = {
            "website_id": website_id,
            "website_name": website.name,
            "domain": domain,
            "status": website.status,
            "database_created": not db_exists,  # True if we just created it
            "user_table_columns": columns,
            "available_tables": list(tables_info.keys()),
            "tables_info": tables_info,
            "management_ready": True
        }
        
        return ManageUserResponse(
            status="success",
            message="Website user management is ready",
            data=response_data
        ).__dict__
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error in manage_user endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred while setting up user management"
        )

@router.get("/manage_user/status")
async def get_user_management_status(
    website_id: int = Query(..., description="Website ID to check status for"),
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the current status of user management setup for a website.
    """
    
    try:
        # Validate website and ownership
        website = db.query(Website).filter(Website.id == website_id).first()
        
        if not website:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Website not found"
            )
        
        user = db.query(User).filter(User.username == current_user.username).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if website.owner_id != user.id and user.role != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to check this website's status"
            )
        
        # Check status
        status_info = {
            "website_id": website_id,
            "website_name": website.name,
            "domain": website.domain,
            "status": website.status,
            "has_domain": bool(website.domain),
            "status_valid": website.status in ['processing', 'published'],
            "database_exists": False,
            "tables_exist": False,
            "ready_for_management": False
        }
        
        if website.domain and website.status in ['processing', 'published']:
            status_info["database_exists"] = client_db_manager.database_exists(website.domain)  # Old naming convention
            status_info["tables_exist"] = client_db_manager.table_exists(website.domain, "users")  # Old naming convention
            status_info["ready_for_management"] = (
                status_info["database_exists"] and status_info["tables_exist"]
            )
        
        return ManageUserResponse(
            status="success",
            message="User management status retrieved",
            data=status_info
        ).__dict__
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_user_management_status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred while checking status"
        )

@router.get("/manage_user/tables")
async def get_available_tables(
    website_id: int = Query(..., description="Website ID to get tables for"),
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get information about all available tables in the client database.
    """
    
    try:
        # Validate website and ownership
        website = db.query(Website).filter(Website.id == website_id).first()
        
        if not website:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Website not found"
            )
        
        user = db.query(User).filter(User.username == current_user.username).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if website.owner_id != user.id and user.role != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this website's tables"
            )
        
        if not website.domain:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Website domain is required"
            )
        
        # Check if database exists (using old naming convention)
        if not client_db_manager.database_exists(website.domain):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client database not found. Please initialize user management first."
            )
        
        # Get all tables and their column information
        session = client_db_manager.get_client_session(website.domain)  # Old naming convention
        if not session:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to connect to client database"
            )
        
        try:
            from sqlalchemy import inspect
            inspector = inspect(session.bind)
            table_names = inspector.get_table_names()
            
            tables_info = {}
            excluded_columns = ['password_hash', 'salt', 'reset_token', 'verification_token']
            
            for table_name in table_names:
                columns = client_db_manager.get_table_columns(
                    website.domain, 
                    table_name, 
                    excluded_columns if table_name == 'users' else []
                )  # Old naming convention
                if columns:
                    tables_info[table_name] = columns
            
            return ManageUserResponse(
                status="success",
                message="Tables information retrieved successfully",
                data={
                    "website_id": website_id,
                    "domain": website.domain,
                    "total_tables": len(table_names),
                    "table_names": table_names,
                    "tables_info": tables_info
                }
            ).__dict__
            
        finally:
            session.close()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_available_tables: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred while retrieving tables information"
        ) 