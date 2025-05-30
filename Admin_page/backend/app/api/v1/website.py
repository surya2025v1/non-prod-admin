from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.website import WebsiteCreate, WebsiteOut
from app.crud.website import upsert_website_for_user, get_websites_for_user
from app.models.user import User
from app.crud.user import get_user_by_username
from app.core.security import TokenData
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

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
            "page_no": w.page_no or 1
        }
        result.append(website_data)
    
    logger.info(f"Returning {len(result)} websites with full data")
    return result 