from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.website import WebsiteCreate, WebsiteOut
from app.crud.website import upsert_website_for_user, get_websites_for_user, create_website_with_defaults, update_website_by_id, delete_website_by_id
from app.models.user import User
from app.crud.user import get_user_by_username
from app.core.security import TokenData
from pydantic import BaseModel
from typing import Optional
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

class WebsiteRequest(BaseModel):
    id: int
    name: Optional[str] = None
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    tagline: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    font: Optional[str] = None
    hero_image_url: Optional[str] = None
    banner_image_url: Optional[str] = None
    intro_text: Optional[str] = None
    photo_gallery_urls: Optional[list] = None
    video_youtube_link: Optional[str] = None
    about: Optional[str] = None
    mission: Optional[str] = None
    history: Optional[str] = None
    services_offerings: Optional[list] = None
    team_members: Optional[list] = None
    social_media_links: Optional[dict] = None
    paid_till: Optional[str] = None
    domain: Optional[str] = None
    is_active: Optional[bool] = None
    page_no: Optional[int] = 1

@router.post("/my_website")
async def create_or_update_website(
    payload: WebsiteRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Website request for user: {current_user.username}, ID: {payload.id}")
    
    user = get_user_by_username(db, current_user.username)
    if not user:
        logger.error(f"User not found: {current_user.username}")
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        if payload.id == 0:
            # INSERT operation - create new record with defaults
            logger.info(f"Creating new website for user {user.id}")
            website = create_website_with_defaults(db, user.id, payload.dict(exclude_unset=True, exclude={'id'}))
            return {"success": True, "website_id": website.id, "message": "Website created successfully"}
        else:
            # UPDATE operation - update existing record
            logger.info(f"Updating website {payload.id} for user {user.id}")
            website = update_website_by_id(db, payload.id, user.id, payload.dict(exclude_unset=True, exclude={'id'}))
            if not website:
                raise HTTPException(status_code=404, detail="Website not found or you don't have permission to update it")
            return {"success": True, "website_id": website.id, "message": "Website updated successfully"}
    except Exception as e:
        logger.error(f"Error processing website request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/add_mysite", response_model=WebsiteOut)
async def add_mysite(
    payload: WebsiteCreate,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = get_user_by_username(db, current_user.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    website = upsert_website_for_user(db, user.id, payload.page_no, payload.dict(exclude_unset=True))
    return website

@router.get("/my_website")
async def my_website(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Getting websites for user: {current_user.username}")
    
    user = get_user_by_username(db, current_user.username)
    if not user:
        logger.error(f"User not found: {current_user.username}")
        raise HTTPException(status_code=404, detail="User not found")
    
    logger.info(f"Found user with ID: {user.id}")
    
    websites = get_websites_for_user(db, user.id)
    logger.info(f"Found {len(websites)} websites for user {user.id}")
    
    if not websites:
        logger.info("No websites found, returning empty list")
        return []
    
    result = []
    for w in websites:
        logger.info(f"Processing website: {w.id}, domain: {w.domain}, status: {w.status}")
        
        # Return all website data except excluded fields (owner_id, id, last_updated, created_at)
        website_data = {
            "name": w.name or "",
            "domain": w.domain or "",
            "status": w.status or "draft",
            "organization_name": w.organization_name or "",
            "organization_type": w.organization_type or "",
            "tagline": w.tagline or "",
            "contact_email": w.contact_email or "",
            "contact_phone": w.contact_phone or "",
            "address": w.address or "",
            "logo_url": w.logo_url or "",
            "favicon_url": w.favicon_url or "",
            "primary_color": w.primary_color or "#0ea5e9",
            "secondary_color": w.secondary_color or "#f0f9ff",
            "font": w.font or "Inter",
            "hero_image_url": w.hero_image_url or "",
            "banner_image_url": w.banner_image_url or "",
            "intro_text": w.intro_text or "",
            "photo_gallery_urls": w.photo_gallery_urls or [],
            "video_youtube_link": w.video_youtube_link or "",
            "about": w.about or "",
            "mission": w.mission or "",
            "history": w.history or "",
            "services_offerings": w.services_offerings or [],
            "team_members": w.team_members or [],
            "social_media_links": w.social_media_links or {},
            "paid_till": w.paid_till.isoformat() if w.paid_till else None,
            "is_active": w.is_active if w.is_active is not None else True,
            "page_no": w.page_no or 1,
            "Website_id": w.id
        }
        result.append(website_data)
    
    logger.info(f"Returning {len(result)} websites with full data")
    return result

class DeleteWebsiteRequest(BaseModel):
    id: int

@router.post("/delete_mysite")
async def delete_mysite(
    payload: DeleteWebsiteRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Delete website request for user: {current_user.username}, Website ID: {payload.id}")
    
    user = get_user_by_username(db, current_user.username)
    if not user:
        logger.error(f"User not found: {current_user.username}")
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        result = delete_website_by_id(db, payload.id, user.id)
        if not result:
            logger.warning(f"Website {payload.id} not found or user {user.id} doesn't have permission to delete it")
            raise HTTPException(status_code=404, detail="Website not found or you don't have permission to delete it")
        
        logger.info(f"Website {payload.id} successfully deleted by user {user.id}")
        return {"success": True, "message": "Website deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting website: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") 