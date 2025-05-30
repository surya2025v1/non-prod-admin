from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import verify_token, TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    """Dependency for protected routes that verifies the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(token)
    if token_data is None:
        raise credentials_exception
    return token_data

def require_role(allowed_roles: List[str]):
    """
    Dependency for role-based access control.
    Usage: @router.get("/admin", dependencies=[Depends(require_role(["admin"]))])
    """
    async def role_checker(current_user: TokenData = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this resource"
            )
        return current_user
    return role_checker 