from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class RansomwareEvent(SQLModel, table=True):
    __tablename__ = "ransomware_events"

    id: Optional[int] = Field(default=None, primary_key=True)
    file_path: str
    entropy: float
    alert_level: str # low, medium, high, critical
    detected_at: datetime = Field(default_factory=datetime.utcnow)
