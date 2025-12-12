from app.services.ip_service import IPService
from app.services.rules_service import RulesService
from app.core.logger import logger

class DDOSProtection:
    def __init__(self, ip_service: IPService, rules_service: RulesService):
        self.ip_service = ip_service
        self.rules_service = rules_service

    async def check_request(self, ip: str) -> bool:
        """
        Returns True if request is allowed, False if blocked (DDoS detected).
        """
        # 1. Update activity
        activity = await self.ip_service.record_request(ip)
        
        # 2. Get current thresholds
        rules = await self.rules_service.get_rules()

        # 3. Check limits
        if activity.requests_last_sec > rules.max_req_per_sec:
            logger.warning(f"DDoS detected (Sec) for IP {ip}: {activity.requests_last_sec} req/s")
            await self.ip_service.block_ip(ip, reason="DDoS: Rate limit exceeded (sec)", duration_minutes=10)
            return False
            
        if activity.requests_last_min > rules.max_req_per_min:
            logger.warning(f"DDoS detected (Min) for IP {ip}: {activity.requests_last_min} req/min")
            await self.ip_service.block_ip(ip, reason="DDoS: Rate limit exceeded (min)", duration_minutes=30)
            return False
            
        return True
