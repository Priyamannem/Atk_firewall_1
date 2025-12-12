from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.middleware.waf_signatures import WAFSignatures
from app.services.logs_service import LogsService

router = APIRouter()

@router.get("/")
async def public_index():
    return {"message": "Welcome to the protected public API."}

@router.post("/submit_data")
async def submit_data(request: Request, session: AsyncSession = Depends(get_session)):
    # This endpoint is manually protected by WAF Signature check for demo purposes
    # Ideally, middleware does this globally, but we demonstrate specific filtering here.
    
    body = await request.body()
    body_str = body.decode("utf-8")
    
    is_safe, attack_type = WAFSignatures.check_payload(body_str)
    
    logs_service = LogsService(session)
    client_ip = request.client.host
    
    if not is_safe:
        await logs_service.log_request(client_ip, "/public/submit_data", 403, attack_type, 1.0, "Blocked by WAF")
        raise HTTPException(status_code=403, detail=f"Malicious content detected: {attack_type}")

    await logs_service.log_request(client_ip, "/public/submit_data", 200, "Normal", 0.0, "Allowed")
    return {"message": "Data received safely"}
