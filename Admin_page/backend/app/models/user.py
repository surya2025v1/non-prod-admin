from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel

# Create SQLAlchemy base class
Base = declarative_base()

# SQLAlchemy model for users table
class User(Base):
    __tablename__ = "users"  # This maps to the table name in the database

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    passwordHash = Column(String(255), nullable=False)
    salt = Column(String(255), nullable=False)
    isActive = Column(Boolean, default=True)
    isVerified = Column(Boolean, default=False)
    verificationToken = Column(String(255))
    lastLogin = Column(DateTime)
    failedLoginAttempts = Column(Integer, default=0)
    accountLockedUntil = Column(DateTime)
    firstName = Column(String(50), nullable=False)
    lastName = Column(String(50), nullable=False)
    role = Column(String(20), default='user')
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic models for request/response validation
class UserLoginRequest(BaseModel):
    username: str
    password: str

class UserLoginResponse(BaseModel):
    status: str
    message: str 