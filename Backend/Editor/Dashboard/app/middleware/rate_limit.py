from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi import FastAPI, Request
import redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Redis connection for rate limiting
try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    # Test connection
    redis_client.ping()
    logger.info("Connected to Redis for rate limiting")
except Exception as e:
    logger.warning(f"Redis connection failed, using in-memory storage: {e}")
    redis_client = None

# Create limiter instance
# Rate limit configuration: configurable via environment variables
# Current setting: 10 requests per minute (configurable in env.example)
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=settings.REDIS_URL if redis_client else "memory://",
    default_limits=[f"{settings.RATE_LIMIT_REQUESTS}/minute"]
)


def setup_rate_limiting(app: FastAPI) -> None:
    """
    Setup rate limiting middleware for the FastAPI app.
    
    Args:
        app: FastAPI application instance
    """
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)
    
    logger.info(f"Rate limiting configured: {settings.RATE_LIMIT_REQUESTS} requests per {settings.RATE_LIMIT_WINDOW} seconds")


def get_client_ip(request: Request) -> str:
    """
    Get client IP address from request.
    
    Args:
        request: FastAPI request object
        
    Returns:
        Client IP address
    """
    # Check for forwarded headers (for load balancers/proxies)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    return request.client.host if request.client else "unknown"


# Custom rate limit decorator for specific endpoints
def custom_rate_limit(requests: int, window: int = 60):
    """
    Custom rate limit decorator.
    
    Args:
        requests: Number of requests allowed
        window: Time window in seconds
        
    Returns:
        Rate limit decorator
    """
    return limiter.limit(f"{requests}/{window}second")


# Higher rate limit for authentication endpoints
auth_rate_limit = custom_rate_limit(5, 60)  # 5 requests per minute for auth

# Standard rate limit for API endpoints
api_rate_limit = custom_rate_limit(settings.RATE_LIMIT_REQUESTS, settings.RATE_LIMIT_WINDOW)

# Stricter rate limit for sensitive operations
strict_rate_limit = custom_rate_limit(3, 300)  # 3 requests per 5 minutes 