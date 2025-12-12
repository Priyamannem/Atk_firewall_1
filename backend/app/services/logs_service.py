from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database.models import TrafficLog
from typing import Optional, List

class LogsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_request(self, ip: str, endpoint: str, status: int, attack_type: Optional[str] = None, threat_score: float = 0.0, reason: Optional[str] = None):
        log = TrafficLog(
            ip=ip,
            endpoint=endpoint,
            status=status,
            attack_type=attack_type,
            threat_score=threat_score,
            reason=reason
        )
        self.session.add(log)
        await self.session.commit()

    async def get_recent_logs(self, limit: int = 200) -> List[TrafficLog]:
        result = await self.session.execute(
            select(TrafficLog).order_by(desc(TrafficLog.timestamp)).limit(limit)
        )
        return result.scalars().all()
