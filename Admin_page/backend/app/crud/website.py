from sqlalchemy.orm import Session
from app.models.website import Website
from sqlalchemy import and_

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

def get_websites_for_user(db: Session, user_id: int):
    return db.query(Website).filter(Website.owner_id == user_id).all() 