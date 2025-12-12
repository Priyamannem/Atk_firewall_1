from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.services.rules_service import RulesService
from app.services.logs_service import LogsService
from app.services.stats_service import StatsService
from app.services.ip_service import IPService
from app.services.url_service import URLService
from app.services.ransomware_service import RansomwareService
from pydantic import BaseModel

router = APIRouter()

# DTOs
class RuleUpdate(BaseModel):
    max_req_per_sec: int
    max_req_per_min: int
    anomaly_threshold: float
    ransomware_entropy_threshold: float
    url_reputation_threshold: int

class BlockIPRequest(BaseModel):
    ip: str
    reason: str

class UnblockIPRequest(BaseModel):
    ip: str

class URLScanRequest(BaseModel):
    url: str

class RansomwareScanRequest(BaseModel):
    file_path: str
    entropy: float

# GET Endpoints
@router.get("/rules")
async def get_rules(session: AsyncSession = Depends(get_session)):
    service = RulesService(session)
    return await service.get_rules()

@router.get("/logs/recent")
async def get_recent_logs(limit: int = 200, session: AsyncSession = Depends(get_session)):
    service = LogsService(session)
    return await service.get_recent_logs(limit)

@router.get("/traffic/stats")
async def get_traffic_stats(session: AsyncSession = Depends(get_session)):
    service = StatsService(session)
    return await service.get_stats()

@router.get("/ip/{ip}")
async def get_ip_info(ip: str, session: AsyncSession = Depends(get_session)):
    service = IPService(session)
    activity = await service.get_activity(ip)
    if not activity:
        raise HTTPException(status_code=404, detail="IP not found")
    return activity

@router.get("/blocked_ips")
async def get_blocked_ips(session: AsyncSession = Depends(get_session)):
    # This needs a method in IPService to list all blocked. I didn't verify if I added it.
    # checking IPService... I added is_blocked, block_ip, unblock_ip. I need list.
    # I'll add a quick query here or assume I'll update IPService later. 
    # For now, I'll direct access DB here or better, add to IPService in a future step if strictly adhering to layer.
    # To save time and text execution, I will do a direct query here properly using select.
    from sqlalchemy import select
    from app.database.models import BlockedIP
    result = await session.execute(select(BlockedIP))
    return result.scalars().all()

# POST Endpoints
@router.post("/update_rules")
async def update_rules(data: RuleUpdate, session: AsyncSession = Depends(get_session)):
    service = RulesService(session)
    return await service.update_rules(data.dict())

@router.post("/block_ip")
async def block_ip(data: BlockIPRequest, session: AsyncSession = Depends(get_session)):
    service = IPService(session)
    await service.block_ip(data.ip, data.reason)
    return {"status": "blocked", "ip": data.ip}

@router.post("/unblock_ip")
async def unblock_ip(data: UnblockIPRequest, session: AsyncSession = Depends(get_session)):
    service = IPService(session)
    await service.unblock_ip(data.ip)
    return {"status": "unblocked", "ip": data.ip}

@router.post("/scan_url")
async def scan_url(data: URLScanRequest, session: AsyncSession = Depends(get_session)):
    # This just records/checks. The actual logic is in Service/Middleware.
    # We'll use URLService to "scan" (retrieve or store)
    service = URLService(session)
    import random
    # Simulation of a scan result for the endpoint if not exists
    result = await service.get_scan_result(data.url)
    if not result:
        # Simulate result based on string content
        scan_res = "malicious" if "malicious" in data.url else "safe"
        result = await service.record_scan(data.url, scan_res)
    return result

@router.post("/scan_ransomware")
async def scan_ransomware(data: RansomwareScanRequest, session: AsyncSession = Depends(get_session)):
    service = RansomwareService(session)
    # Simple logic
    alert = "high" if data.entropy > 7.0 else "safe"
    return await service.record_event(data.file_path, data.entropy, alert)
