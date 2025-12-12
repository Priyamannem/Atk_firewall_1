from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.models import URLScan
from typing import Optional

class URLService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def record_scan(self, url: str, scan_result: str, threat_type: Optional[str] = None):
        scan = URLScan(url=url, scan_result=scan_result, threat_type=threat_type)
        self.session.add(scan)
        await self.session.commit()
        await self.session.refresh(scan)
        return scan

    async def get_scan_result(self, url: str) -> Optional[URLScan]:
        # Get most recent scan
        result = await self.session.execute(select(URLScan).where(URLScan.url == url).order_by(URLScan.scanned_at.desc()))
        return result.scalars().first()
