from app.services.url_service import URLService
from app.services.rules_service import RulesService
from app.core.logger import logger
import re

class URLFilter:
    def __init__(self, url_service: URLService, rules_service: RulesService):
        self.service = url_service
        self.rules_service = rules_service

    async def check_url(self, url: str) -> bool:
        """
        Returns True if safe, False if malicious.
        """
        # 1. Check DB for known bad URLs (cache/db check)
        existing_scan = await self.service.get_scan_result(url)
        if existing_scan and existing_scan.scan_result == "malicious":
            return False
        
        # 2. Simple Heuristics (Placeholder for ML)
        suspicious_patterns = [r"login", r"verify", r"account", r"update", r"\.exe$", r"\.zip$"]
        # Very naive check for demo
        # Real logic would use an external API or ML model here
        
        # rules = await self.rules_service.get_rules()
        # threshold = rules.url_reputation_threshold 

        # For this prototype, if it contains "malicious", block it.
        if "malicious" in url:
             await self.service.record_scan(url, "malicious", "keyword_match")
             return False
             
        # Log scan
        await self.service.record_scan(url, "safe")
        return True
