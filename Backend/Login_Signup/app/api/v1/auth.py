from fastapi import APIRouter, HTTPException, Depends, status, Request
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis
import logging
from fastapi.responses import JSONResponse

from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_login_response, sanitize_input
from app.schemas.auth import (
    LoginRequest, LoginResponse, SignupRequest, SignupResponse, 
    ErrorResponse, TokenValidationResponse
)
from app.crud.user import authenticate_user, create_user, check_email_exists

# Setup logging
logger = logging.getLogger(__name__)

# Setup rate limiter with Redis fallback
try:
    redis_client = redis.from_url(settings.REDIS_URL)
    redis_client.ping()  # Test connection
    limiter = Limiter(key_func=get_remote_address, storage_uri=settings.REDIS_URL)
    logger.info("Rate limiter using Redis storage")
except Exception as e:
    logger.warning(f"Redis connection failed, using memory storage: {e}")
    limiter = Limiter(key_func=get_remote_address)

# Create router
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Note: Rate limit exception handler is registered in main.py on the FastAPI app


@router.post("/login", response_model=LoginResponse)
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/minute")
async def login(
    request: Request,
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and generate JWT token.
    
    **Security Features:**
    - Rate limiting (5 attempts per minute)
    - Account lockout after failed attempts
    - Password verification with bcrypt
    - Input sanitization
    - Comprehensive logging
    
    **Request Body:**
    ```json
    {
        "userid": "user@example.com",  // Email or username
        "password": "userpassword"
    }
    ```
    
    **Response:**
    ```json
    {
        "access_token": "jwt_token_here",
        "token_type": "bearer",
        "expires_in": 1800,
        "user": {
            "id": 1,
            "username": "user@example.com",
            "role": "User"
        }
    }
    ```
    
    **Error Codes:**
    - 400: Invalid input data
    - 401: Invalid credentials
    - 423: Account locked
    - 429: Rate limit exceeded
    - 500: Server error
    """
    try:
        # Sanitize input
        userid = sanitize_input(login_data.userid)
        password = login_data.password  # Don't sanitize password as it may contain special chars
        
        # Log login attempt (without sensitive data)
        client_ip = get_remote_address(request)
        logger.info(f"Login attempt for user: {userid} from IP: {client_ip}")
        
        # Validate input
        if not userid or not password:
            logger.warning(f"Invalid login input from IP: {client_ip}")
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False, "message": "User ID and password are required"}
            )
        
        # Authenticate user
        user = authenticate_user(db, userid, password)
        
        if not user:
            logger.warning(f"Failed authentication for user: {userid} from IP: {client_ip}")
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"success": False, "message": "Invalid credentials"}
            )
        
        # Check if account is locked
        if user.is_account_locked():
            logger.warning(f"Login attempt for locked account: {user.email} from IP: {client_ip}")
            return JSONResponse(
                status_code=status.HTTP_423_LOCKED,
                content={"success": False, "message": "Account is temporarily locked due to multiple failed login attempts"}
            )
        
        # Create login response with JWT token
        resp = create_login_response(user.id, user.username, user.role)
        
        logger.info(f"Successful login for user: {user.email} (ID: {user.id}) from IP: {client_ip}")
        # Return a dict with success: true and the token details
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"success": True, "access_token": resp["access_token"], "token_type": resp["token_type"], "expires_in": resp["expires_in"], "user": resp["user"]}
        )
        
    except Exception as e:
        logger.error(f"Login error for user: {userid} - {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": "Internal server error during login"}
        )


@router.post("/signup", response_model=SignupResponse)
@limiter.limit(f"{settings.SIGNUP_RATE_LIMIT}/minute")
async def signup(
    request: Request,
    signup_data: SignupRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user account.
    
    **Security Features:**
    - Rate limiting (3 signups per minute)
    - Email validation (using pydantic's EmailStr)
    - Password hashing (using bcrypt)
    - Input sanitization (and duplicate email prevention)
    
    **Request Body (JSON):**
    (Note: The field must be "email" (and not "emailid").)
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "password": "secure_password"
    }
    
    **Response (JSON):**
    - On success (200 OK):
      {
          "success": true,
          "message": "Account created successfully",
          "user_id": 123
      }
    - On error (e.g. 422 Unprocessable Content):
      {
          "success": false,
          "message": "Invalid request body (e.g. missing or misnamed fields)."
      }
    
    **Error Codes:**
    - 400: Invalid input (e.g. missing fields)
    - 409: Email already exists
    - 422: Unprocessable (e.g. misnamed fields (e.g. "emailid" instead of "email"))
    - 429: Rate limit exceeded
    - 500: Internal server error
    """
    try:
        # Log the incoming request body (for debugging)
        body = await request.json()
        logger.info(f"Signup request body: {body}")
        # (If the UI sends "emailid" (or misnamed fields), pydantic (SignupRequest) will raise a ValidationError.)
    except Exception as e:
        logger.error(f"Error parsing signup request body: {e}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"success": False, "message": "Invalid request body (e.g. missing or misnamed fields)."}
        )
    try:
        # Get client IP for logging
        client_ip = get_remote_address(request)
        logger.info(f"Signup attempt for email: {signup_data.email} from IP: {client_ip}")
        # Check if email already exists
        if check_email_exists(db, signup_data.email):
            logger.warning(f"Signup attempt with existing email: {signup_data.email} from IP: {client_ip}")
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={"success": False, "message": "Email address is already registered"}
            )
        # Create new user
        new_user = create_user(db, signup_data)
        logger.info(f"User signup successful: {new_user.email} (ID: {new_user.id}) from IP: {client_ip}")
        return SignupResponse(
            success=True,
            message="Account created successfully",
            user_id=new_user.id
        )
    except Exception as e:
        logger.error(f"Signup error for email: {signup_data.email} - {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": "Internal server error during signup"}
        )


@router.get("/health")
async def health_check():
    """
    Health check endpoint for the authentication service.
    
    **Response:**
    ```json
    {
        "status": "healthy",
        "service": "Temple Management Login/Signup",
        "version": "1.0.0"
    }
    ```
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT
    }


@router.post("/validate-token", response_model=TokenValidationResponse)
async def validate_token(
    request: Request,
    token: str,
    db: Session = Depends(get_db)
):
    """
    Validate JWT token and return user information.
    
    **Note:** This endpoint is for internal validation only.
    Production systems should validate tokens locally for performance.
    
    **Request Body:**
    ```json
    {
        "token": "jwt_token_here"
    }
    ```
    
    **Response:**
    ```json
    {
        "valid": true,
        "user_id": 123,
        "username": "user@example.com",
        "role": "User",
        "message": "Token is valid"
    }
    ```
    """
    try:
        from app.core.security import verify_token
        from app.crud.user import get_user_by_id
        
        # Verify token
        user_id = verify_token(token)
        
        if not user_id:
            return TokenValidationResponse(
                valid=False,
                message="Invalid token"
            )
        
        # Get user details
        user = get_user_by_id(db, int(user_id))
        
        if not user:
            return TokenValidationResponse(
                valid=False,
                message="User not found"
            )
        
        if not user.is_active:
            return TokenValidationResponse(
                valid=False,
                message="User account is inactive"
            )
        
        return TokenValidationResponse(
            valid=True,
            user_id=user.id,
            username=user.username,
            role=user.role,
            message="Token is valid"
        )
        
    except Exception as e:
        logger.error(f"Token validation error: {str(e)}")
        return TokenValidationResponse(
            valid=False,
            message="Token validation failed"
        )


@router.post("/forgot-password", response_model=dict)
async def forgot_password(request: Request, email: str, db: Session = Depends(get_db)):
    """
    Endpoint for "Forgot Password" (a stub that returns a success message).
    In a real implementation, you'd generate a reset link (e.g. a JWT or a token) and send an email.
    (This endpoint is intended for UI integration so that a "Forgot Password" link can be added.)
    """
    # (In a real implementation, you'd check if the email exists, generate a reset token, and send an email.)
    # For now, we return a success message.
    return {"success": True, "message": "Reset password link sent."} 