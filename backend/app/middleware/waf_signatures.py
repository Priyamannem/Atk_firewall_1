import re

class WAFSignatures:
    
    SQLI_PATTERNS = [
        r"(\%27)|(\')", 
        r"(\-\-)", 
        r"(\%23)|(#)", 
        r"((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))",
        r"\w*((\%27)|(\'))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))", 
        r"exec(\s|\+)+(s|x)p\w+"
    ]
    
    XSS_PATTERNS = [
        r"<script>", 
        r"javascript:", 
        r"onload=", 
        r"onerror="
    ]
    
    CMD_INJECTION_PATTERNS = [
        r";\s*ls", 
        r"\|\s*ls", 
        r"&&\s*ls", 
        r";\s*cat",
        r"\|\s*cat"
    ]

    @staticmethod
    def check_payload(payload: str) -> tuple[bool, str]:
        """
        Returns (is_safe: bool, attack_type: str)
        """
        for pattern in WAFSignatures.SQLI_PATTERNS:
            if re.search(pattern, payload, re.IGNORECASE):
                return False, "SQL Injection"
                
        for pattern in WAFSignatures.XSS_PATTERNS:
            if re.search(pattern, payload, re.IGNORECASE):
                return False, "XSS"
                
        for pattern in WAFSignatures.CMD_INJECTION_PATTERNS:
            if re.search(pattern, payload, re.IGNORECASE):
                return False, "Command Injection"
                
        return True, None
