"""
Application Configuration - loads from environment variables.
MSc Cloud DevOpsSec - Construction Progress Tracker
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/constructtrack"
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production-min-32-chars!!"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440
    APP_NAME: str = "Construction Progress Tracker API"
    DEBUG: bool = False
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
