from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class TrafficLog(SQLModel, table=True):
    __tablename__ = "traffic_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    ip: str = Field(index=True)
    endpoint: str
    status: int
    attack_type: Optional[str] = None
    threat_score: float = Field(default=0.0)
    reason: Optional[str] = None
