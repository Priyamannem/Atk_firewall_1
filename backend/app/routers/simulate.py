from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.services.ip_service import IPService
from app.services.ransomware_service import RansomwareService
from pydantic import BaseModel

router = APIRouter()

class RansomwareSimRequest(BaseModel):
    file_count: int

@router.get("/ddos")
async def simulate_ddos(count: int = 5000, ip: str = "1.2.3.4", session: AsyncSession = Depends(get_session)):
    """
    Simulates DDoS by hitting the IP record logic multiple times.
    """
    service = IPService(session)
    # in a real threaded app, this might block, but here it's async loop
    # We will just increment the counter artificially to simulate high load
    for _ in range(min(count, 1000)): # Limit to 1000 per request to avoid timeout
        await service.record_request(ip)
    
    return {"status": "simulated", "count": count, "target_ip": ip}

@router.post("/ransomware")
async def simulate_ransomware(data: RansomwareSimRequest, session: AsyncSession = Depends(get_session)):
    service = RansomwareService(session)
    import random
    events = []
    for i in range(data.file_count):
        entropy = random.uniform(5.0, 9.0)
        alert = "high" if entropy > 7.5 else "low"
        event = await service.record_event(f"/tmp/file_{i}.enc", entropy, alert)
        events.append(event)
    return {"status": "simulated", "events_created": len(events)}
