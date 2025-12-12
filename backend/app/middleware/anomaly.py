from app.services.ip_service import IPService
from app.services.rules_service import RulesService
from app.core.logger import logger

class AnomalyDetector:
    def __init__(self, ip_service: IPService, rules_service: RulesService):
        self.ip_service = ip_service
        self.rules_service = rules_service

    async def check_ip(self, ip: str) -> bool:
        """
        Detects anomalies based on IP patterns.
        """
        activity = await self.ip_service.get_activity(ip)
        if not activity:
            return True # No history
            
        rules = await self.rules_service.get_rules()
        
        # Example Anomaly: Total requests massively exceeds threshold (simple placeholder)
        if activity.total_requests > rules.anomaly_threshold:
             logger.warning(f"Anomaly detected for IP {ip}: High total requests {activity.total_requests}")
             # We might not block immediately on anomaly, maybe just flag or lower score
             # But prompt implies blocking or detection.
             return False

        return True
