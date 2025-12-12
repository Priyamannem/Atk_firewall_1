from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class FirewallRule(SQLModel, table=True):
    __tablename__ = "firewall_rules"

    id: Optional[int] = Field(default=None, primary_key=True)
    max_req_per_sec: int
    max_req_per_min: int
    anomaly_threshold: float
    ransomware_entropy_threshold: float
    url_reputation_threshold: int
    updated_at: datetime = Field(default_factory=datetime.utcnow)
