from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database.models import TrafficLog, IPActivity, BlockedIP

class StatsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_stats(self):
        total_requests = await self.session.execute(select(func.count(TrafficLog.id)))
        total_blocked = await self.session.execute(select(func.count(BlockedIP.id)))
        active_ips = await self.session.execute(select(func.count(IPActivity.id))) # Total tracked IPs
        
        # Attack type distribution
        attack_types_result = await self.session.execute(
            select(TrafficLog.attack_type, func.count(TrafficLog.id))
            .where(TrafficLog.attack_type != None)
            .group_by(TrafficLog.attack_type)
        )
        
        return {
            "total_requests": total_requests.scalar_one(),
            "blocked_ips_count": total_blocked.scalar_one(),
            "tracked_ips_count": active_ips.scalar_one(),
            "attack_distribution": dict(attack_types_result.all())
        }
