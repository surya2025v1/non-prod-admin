from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator
import secrets


class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/temple_management"
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 3306
    DATABASE_USER: str = "root"
    DATABASE_PASSWORD: str = "password"
    DATABASE_NAME: str = "temple_management"
    
    # JWT Configuration
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Security Configuration
    # TODO: Replace localhost with actual domain name when going live
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8080"]
    
    # Rate Limiting Configuration (Configurable - Change these values as needed)
    RATE_LIMIT_REQUESTS: int = 10  # Number of requests allowed
    RATE_LIMIT_WINDOW: int = 60    # Time window in seconds
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Temple Management System"
    PROJECT_VERSION: str = "1.0.0"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @field_validator("DATABASE_URL")
    @classmethod
    def build_database_url(cls, v: Optional[str], values=None) -> str:
        if isinstance(v, str) and v:
            return v
        # For field_validator, we need to access other values differently
        return v or "mysql+pymysql://root:password@localhost:3306/temple_management"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings() 