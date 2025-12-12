from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import RansomwareEvent

class RansomwareService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def record_event(self, file_path: str, entropy: float, alert_level: str):
        event = RansomwareEvent(file_path=file_path, entropy=entropy, alert_level=alert_level)
        self.session.add(event)
        await self.session.commit()
        await self.session.refresh(event)
        return event
