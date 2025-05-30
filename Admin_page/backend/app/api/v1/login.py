from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import (
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    Token,
    TokenData,
    get_password_hash
)
from app.db.session import get_db
from app.crud import user as user_crud
from app.api.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    Returns token with user role information.
    """
    # Get user from database
    user = user_crud.get_user_by_username(db, username=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user.passwordHash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.isActive:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token with role information
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.username,
            "role": user.role  # Include role in token data
        },
        expires_delta=access_token_expires
    )
    
    # Return token with role and username information
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,  # Include role in response
        "username": user.firstName + " " + user.lastName  # Include username in response
    }

@router.get("/me")
async def get_me(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user info based on Bearer token.
    """
    user = user_crud.get_user_by_username(db, username=current_user.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "username": user.username,
        "firstName": user.firstName,
        "lastName": user.lastName
    }

class UpdateMeRequest(BaseModel):
    firstName: str | None = None
    lastName: str | None = None
    password: str | None = None

@router.patch("/me")
async def update_me(
    payload: UpdateMeRequest = Body(...),
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user info based on Bearer token.
    """
    user = user_crud.get_user_by_username(db, username=current_user.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    updated = False
    if payload.firstName is not None:
        user.firstName = payload.firstName
        updated = True
    if payload.lastName is not None:
        user.lastName = payload.lastName
        updated = True
    if payload.password:
        user.passwordHash = get_password_hash(payload.password)
        updated = True
    if updated:
        db.commit()
        db.refresh(user)
    return {
        "username": user.username,
        "firstName": user.firstName,
        "lastName": user.lastName
    } 