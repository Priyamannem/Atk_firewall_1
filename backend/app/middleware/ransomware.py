import math
from app.services.ransomware_service import RansomwareService
from app.services.rules_service import RulesService
from app.core.logger import logger

class RansomwareDetector:
    def __init__(self, ransomware_service: RansomwareService, rules_service: RulesService):
        self.service = ransomware_service
        self.rules_service = rules_service

    def calculate_entropy(self, data: bytes) -> float:
        if not data:
            return 0.0
        entropy = 0
        for x in range(256):
            p_x = float(data.count(x)) / len(data)
            if p_x > 0:
                entropy += - p_x * math.log(p_x, 2)
        return entropy

    async def check_file(self, file_path: str, data: bytes = None) -> bool:
        """
        Returns True if safe, False if ransomware suspected.
        """
        # If we have raw data, calc entropy. If not, maybe file_path implies we read it, 
        # but for backend API context, we might receive metadata or content.
        # Assuming data is provided for analysis. 
        if data:
            entropy = self.calculate_entropy(data)
        else:
            # Placeholder: In real scenario, we might read the file if it's local upload
            entropy = 0.0 

        rules = await self.rules_service.get_rules()
        
        if entropy > rules.ransomware_entropy_threshold:
            logger.warning(f"High entropy detected: {entropy} in {file_path}")
            await self.service.record_event(file_path, entropy, "high")
            return False
            
        return True
