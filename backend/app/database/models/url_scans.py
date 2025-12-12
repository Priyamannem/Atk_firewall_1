from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class URLScan(SQLModel, table=True):
    __tablename__ = "url_scans"

    id: Optional[int] = Field(default=None, primary_key=True)
    url: str = Field(index=True)
    scan_result: str # safe, malicious, suspicious
    threat_type: Optional[str] = None
    scanned_at: datetime = Field(default_factory=datetime.utcnow)
