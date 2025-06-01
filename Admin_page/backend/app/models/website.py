from sqlalchemy import Column, BigInteger, Integer, String, DateTime, Enum, Boolean, ForeignKey, Text, Date, JSON
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from app.db.base import Base

class Website(Base):
    __tablename__ = "websites"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    status = Column(Enum('draft', 'published', 'archived'), default='draft')
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    organization_name = Column(String(100))
    organization_type = Column(String(50))
    tagline = Column(String(255))
    contact_email = Column(String(100))
    contact_phone = Column(String(30))
    address = Column(String(255))
    logo_url = Column(String(255))
    favicon_url = Column(String(255))
    primary_color = Column(String(20))
    secondary_color = Column(String(20))
    font = Column(String(50))
    hero_image_url = Column(String(255))
    banner_image_url = Column(String(255))
    intro_text = Column(Text)
    photo_gallery_urls = Column(JSON)
    video_youtube_link = Column(String(255))
    about = Column(Text)
    mission = Column(Text)
    history = Column(Text)
    services_offerings = Column(JSON)
    team_members = Column(JSON)
    social_media_links = Column(JSON)
    paid_till = Column(Date)
    domain = Column(String(100))
    is_active = Column(Boolean, default=True)
    page_no = Column(Integer)

# Pydantic schemas for API
class WebsiteCreate(BaseModel):
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
    photo_gallery_urls: Optional[Any] = None
    video_youtube_link: Optional[str] = None
    about: Optional[str] = None
    mission: Optional[str] = None
    history: Optional[str] = None
    services_offerings: Optional[Any] = None
    team_members: Optional[Any] = None
    social_media_links: Optional[Any] = None
    paid_till: Optional[str] = None
    domain: Optional[str] = None
    is_active: Optional[bool] = None
    page_no: int

class WebsiteOut(BaseModel):
    id: int
    owner_id: int
    name: Optional[str]
    status: str
    last_updated: Optional[datetime]
    created_at: Optional[datetime]
    organization_name: Optional[str]
    organization_type: Optional[str]
    tagline: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    address: Optional[str]
    logo_url: Optional[str]
    favicon_url: Optional[str]
    primary_color: Optional[str]
    secondary_color: Optional[str]
    font: Optional[str]
    hero_image_url: Optional[str]
    banner_image_url: Optional[str]
    intro_text: Optional[str]
    photo_gallery_urls: Optional[Any]
    video_youtube_link: Optional[str]
    about: Optional[str]
    mission: Optional[str]
    history: Optional[str]
    services_offerings: Optional[Any]
    team_members: Optional[Any]
    social_media_links: Optional[Any]
    paid_till: Optional[str]
    domain: Optional[str]
    is_active: Optional[bool]
    page_no: Optional[int]

    class Config:
        orm_mode = True 