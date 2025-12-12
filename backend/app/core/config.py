from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Modular Firewall Backend"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/firewall_db"
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    
    # Default Firewall Rules
    DEFAULT_MAX_REQ_PER_SEC: int = 100
    DEFAULT_MAX_REQ_PER_MIN: int = 1000
    DEFAULT_ANOMALY_THRESHOLD: float = 5000.0
    DEFAULT_RANSOMWARE_ENTROPY_THRESHOLD: float = 7.5
    DEFAULT_URL_REPUTATION_THRESHOLD: int = 70

    class Config:
        env_file = ".env"

settings = Settings()
