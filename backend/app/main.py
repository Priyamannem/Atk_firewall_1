from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Ensure 'backend' is in python path so 'app' imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.append(backend_dir)

from app.routers import admin, simulate, public
from app.database.db import init_db, get_session, engine
from app.core.logger import logger
from app.middleware.ddos import DDOSProtection
from app.middleware.anomaly import AnomalyDetector
from app.services.ip_service import IPService
from app.services.rules_service import RulesService
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession


app = FastAPI(title="Modular Firewall Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()
    logger.info("Database initialized.")

# Global Security Middleware
@app.middleware("http")
async def validation_middleware(request: Request, call_next):
    # Skip docs/openapi
    if request.url.path in ["/docs", "/openapi.json", "/health"]:
        return await call_next(request)

    # We need a session for checking IP/Rules
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        ip_service = IPService(session)
        rules_service = RulesService(session)
        
        client_ip = request.client.host
        
        # 1. Check if IP is blocked
        if await ip_service.is_blocked(client_ip):
            logger.warning(f"Blocked request from {client_ip}")
            return Response(content="Access Denied: IP Blocked", status_code=403)
        
        # 2. DDoS Protection
        ddos_protection = DDOSProtection(ip_service, rules_service)
        if not await ddos_protection.check_request(client_ip):
            return Response(content="Access Denied: Rate Limit Exceeded", status_code=429)

        # 3. Anomaly Detection (Silent or Block?)
        # anomaly_detector = AnomalyDetector(ip_service, rules_service)
        # if not await anomaly_detector.check_ip(client_ip):
        #    logger.info(f"Anomaly detected for {client_ip}")

    # Proceed
    response = await call_next(request)
    return response

# Routers
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(simulate.router, prefix="/simulate", tags=["Simulation"])
app.include_router(public.router, prefix="/public", tags=["Public"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
