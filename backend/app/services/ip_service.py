from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.database.models import IPActivity, BlockedIP
from datetime import datetime, timedelta

class IPService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_activity(self, ip: str) -> IPActivity:
        result = await self.session.execute(select(IPActivity).where(IPActivity.ip_address == ip))
        return result.scalars().first()

    async def record_request(self, ip: str):
        activity = await self.get_activity(ip)
        now = datetime.utcnow()
        if not activity:
            activity = IPActivity(ip_address=ip, requests_last_sec=1, requests_last_min=1, total_requests=1, first_seen=now, last_seen=now)
            self.session.add(activity)
        else:
            # Simple simulation of rolling windows would be more complex; 
            # for now we just increment. A real system would reset these counters based on time.
            # Here we assume a background job or a check resets them, or we just increment knowing they need management.
            # To make it slightly realistic effectively immediately:
            time_diff = (now - activity.last_seen).total_seconds()
            if time_diff > 1:
                activity.requests_last_sec = 0
            if time_diff > 60:
                activity.requests_last_min = 0

            activity.requests_last_sec += 1
            activity.requests_last_min += 1
            activity.total_requests += 1
            activity.last_seen = now
        
        await self.session.commit()
        await self.session.refresh(activity)
        return activity

    async def is_blocked(self, ip: str) -> bool:
        result = await self.session.execute(
            select(BlockedIP).where(BlockedIP.ip == ip)
        )
        blocked = result.scalars().first()
        if blocked:
            if blocked.unblock_at and blocked.unblock_at < datetime.utcnow():
                await self.unblock_ip(ip)
                return False
            return True
        # Also check temporary block in IPActivity
        activity = await self.get_activity(ip)
        if activity and activity.blocked_until and activity.blocked_until > datetime.utcnow():
            return True
        return False

    async def block_ip(self, ip: str, reason: str, duration_minutes: int = 0):
        # Permanent block if duration_minutes is 0 (or very long), else temp
        now = datetime.utcnow()
        
        if duration_minutes > 0:
            unblock_at = now + timedelta(minutes=duration_minutes)
            stmt = select(BlockedIP).where(BlockedIP.ip == ip)
            result = await self.session.execute(stmt)
            existing = result.scalars().first()
            if not existing:
                blocked = BlockedIP(ip=ip, reason=reason, blocked_at=now, unblock_at=unblock_at)
                self.session.add(blocked)
        else:
            # Permanent
            stmt = select(BlockedIP).where(BlockedIP.ip == ip)
            result = await self.session.execute(stmt)
            existing = result.scalars().first()
            if not existing:
                blocked = BlockedIP(ip=ip, reason=reason, blocked_at=now, unblock_at=None)
                self.session.add(blocked)

        await self.session.commit()

    async def unblock_ip(self, ip: str):
        result = await self.session.execute(select(BlockedIP).where(BlockedIP.ip == ip))
        blocked = result.scalars().first()
        if blocked:
            await self.session.delete(blocked)
        
        activity = await self.get_activity(ip)
        if activity:
            activity.blocked_until = None
            self.session.add(activity)

        await self.session.commit()
