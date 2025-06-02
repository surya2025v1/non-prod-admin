from sqlalchemy.orm import Session
from app.models.website import Website
from sqlalchemy import and_
from datetime import datetime

def upsert_website_for_user(db: Session, user_id: int, page_no: int, data: dict):
    # Try to find an existing website for this user and page_no
    website = db.query(Website).filter(and_(Website.owner_id == user_id, Website.page_no == page_no)).first()
    if website:
        # Update only provided fields
        for key, value in data.items():
            if hasattr(website, key) and value is not None:
                setattr(website, key, value)
        website.last_updated = db.func.now()
        website.status = 'draft'
        if page_no == 1:
            website.created_at = db.func.now()
            website.is_active = True
        db.commit()
        db.refresh(website)
        return website
    else:
        # Insert new website row with only provided fields
        fields = {k: v for k, v in data.items() if hasattr(Website, k) and v is not None}
        fields['owner_id'] = user_id
        fields['page_no'] = page_no
        fields['status'] = 'draft'
        fields['last_updated'] = db.func.now()
        if page_no == 1:
            fields['created_at'] = db.func.now()
            fields['is_active'] = True
        website = Website(**fields)
        db.add(website)
        db.commit()
        db.refresh(website)
        return website

def create_website_with_defaults(db: Session, user_id: int, data: dict):
    """Create a new website record with default values for unspecified fields"""
    # Set default values
    defaults = {
        'owner_id': user_id,
        'name': data.get('organization_name', 'My Website'),
        'status': 'draft',
        'created_at': datetime.utcnow(),
        'last_updated': datetime.utcnow(),
        'primary_color': '#0ea5e9',
        'secondary_color': '#f0f9ff',
        'font': 'Inter',
        'is_active': True,
        'page_no': 1,
        'photo_gallery_urls': [],
        'services_offerings': [],
        'team_members': [],
        'social_media_links': {}
    }
    
    # Merge provided data with defaults
    fields = {**defaults, **{k: v for k, v in data.items() if hasattr(Website, k) and v is not None}}
    
    website = Website(**fields)
    db.add(website)
    db.commit()
    db.refresh(website)
    return website

def update_website_by_id(db: Session, website_id: int, user_id: int, data: dict):
    """Update an existing website by ID, ensuring the user owns it"""
    # Find the website and verify ownership
    website = db.query(Website).filter(and_(Website.id == website_id, Website.owner_id == user_id)).first()
    
    if not website:
        return None
    
    # Update only provided fields
    for key, value in data.items():
        if hasattr(website, key) and value is not None:
            setattr(website, key, value)
    
    website.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(website)
    return website

def get_websites_for_user(db: Session, user_id: int):
    return db.query(Website).filter(and_(Website.owner_id == user_id, Website.is_active == True)).all()

def delete_website_by_id(db: Session, website_id: int, user_id: int):
    """Logically delete a website by ID by setting is_active to False, ensuring the user owns it"""
    # Find the website and verify ownership
    website = db.query(Website).filter(and_(Website.id == website_id, Website.owner_id == user_id)).first()
    
    if not website:
        return None
    
    # Logically delete the website by setting is_active to False
    website.is_active = False
    website.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(website)
    return True 