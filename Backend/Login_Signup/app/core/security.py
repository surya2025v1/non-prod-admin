from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Password hashing context with enhanced security
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__rounds=12  # Higher rounds for better security
)


def create_access_token(
    subject: Union[str, Any], 
    expires_delta: Optional[timedelta] = None,
    additional_claims: Optional[dict] = None
) -> str:
    """
    Create a JWT access token with configurable expiration.
    
    Args:
        subject: The subject of the token (usually user ID)
        expires_delta: Optional expiration time delta
        additional_claims: Additional claims to include in token
        
    Returns:
        Encoded JWT token string
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    # Base payload
    to_encode = {"exp": expire, "sub": str(subject), "iat": datetime.utcnow()}
    
    # Add additional claims if provided
    if additional_claims:
        to_encode.update(additional_claims)
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    logger.info(f"Access token created for subject: {subject}")
    return encoded_jwt


def verify_token(token: str) -> Optional[str]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        User ID if token is valid, None otherwise
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except JWTError as e:
        logger.warning(f"Token verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {str(e)}")
        return False


def get_password_hash(password: str) -> str:
    """
    Hash a password with bcrypt and salt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    try:
        return pwd_context.hash(password)
    except Exception as e:
        logger.error(f"Password hashing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing password"
        )


def create_login_response(user_id: int, username: str, role: str) -> dict:
    """
    Create a standardized login response with token.
    
    Args:
        user_id: User ID
        username: Username
        role: User role
        
    Returns:
        Login response dictionary
    """
    # Create token with user info in claims
    additional_claims = {
        "username": username,
        "role": role,
        "token_type": "access"
    }
    
    access_token = create_access_token(
        subject=user_id,
        additional_claims=additional_claims
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
        "user": {
            "id": user_id,
            "username": username,
            "role": role
        }
    }


def validate_email_format(email: str) -> bool:
    """
    Basic email format validation.
    
    Args:
        email: Email address
        
    Returns:
        True if email format is valid
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def sanitize_input(input_string: str) -> str:
    """
    Sanitize input to prevent injection attacks.
    
    Args:
        input_string: Input string to sanitize
        
    Returns:
        Sanitized string
    """
    if not input_string:
        return ""
    
    # Remove dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', '\x00', '\n', '\r', '\t']
    sanitized = input_string
    
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    
    return sanitized.strip()


def is_password_secure(password: str) -> tuple[bool, str]:
    """
    Basic password security check (optional, as validation is in UI).
    
    Args:
        password: Password to check
        
    Returns:
        Tuple of (is_secure, message)
    """
    if len(password) < 6:
        return False, "Password too short"
    
    return True, "Password acceptable" 