from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator
import secrets


class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str = "mysql+pymysql://root:new_password@localhost:3306/svtemple_2"
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 3306
    DATABASE_USER: str = "root"
    DATABASE_PASSWORD: str = "new_password"
    DATABASE_NAME: str = "svtemple_2"
    
    # JWT Configuration (Configurable token expiration)
    SECRET_KEY: str = "your-shared-secret-key-change-in-production"  # Fixed key for token sharing between services
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Configurable - change as needed
    
    # Security Configuration
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8080", "http://localhost:8001", "http://localhost:8002"]
    
    # Rate Limiting Configuration (Stricter for auth endpoints)
    RATE_LIMIT_REQUESTS: int = 5   # 5 login attempts per minute
    RATE_LIMIT_WINDOW: int = 60    # Time window in seconds
    SIGNUP_RATE_LIMIT: int = 3     # 3 signup attempts per minute
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Temple Management Login/Signup"
    PROJECT_VERSION: str = "1.0.0"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Account Security
    MAX_LOGIN_ATTEMPTS: int = 5        # Account lockout after failed attempts
    LOCKOUT_DURATION_MINUTES: int = 15 # Account lockout duration
    
    @field_validator("DATABASE_URL")
    @classmethod
    def build_database_url(cls, v: Optional[str], values=None) -> str:
        if isinstance(v, str) and v:
            return v
        return v or "mysql+pymysql://root:password@localhost:3306/temple_management"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings() 