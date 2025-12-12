from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class BlockedIP(SQLModel, table=True):
    __tablename__ = "blocked_ips"

    id: Optional[int] = Field(default=None, primary_key=True)
    ip: str = Field(index=True, unique=True)
    reason: str
    blocked_at: datetime = Field(default_factory=datetime.utcnow)
    unblock_at: Optional[datetime] = None
