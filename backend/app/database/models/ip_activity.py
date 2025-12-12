from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class IPActivity(SQLModel, table=True):
    __tablename__ = "ip_activity"

    id: Optional[int] = Field(default=None, primary_key=True)
    ip_address: str = Field(index=True, unique=True)
    requests_last_sec: int = Field(default=0)
    requests_last_min: int = Field(default=0)
    total_requests: int = Field(default=0)
    blocked_until: Optional[datetime] = Field(default=None)
    first_seen: datetime = Field(default_factory=datetime.utcnow)
    last_seen: datetime = Field(default_factory=datetime.utcnow)
