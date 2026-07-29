import os
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "CampusQ"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "campusq_super_secret_jwt_key_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Local SQLite database (works out of the box without Docker/PostgreSQL)
    DATABASE_URL: str = "sqlite:///./campusq.db"
    
    ALLOWED_ORIGINS: List[str] = ["*"]

    class Config:
        case_sensitive = True


# Create settings instance
settings = Settings()