from core.config import settings

async def check_reputation(target: str) -> dict:
    # If using mock (as requested/approved in the plan), return standard simulated responses
    result = {
        "virustotal": {"malicious": 0, "suspicious": 0, "undetected": 88, "harmless": 10, "status": "clean"},
        "abuseipdb": {"abuseConfidenceScore": 0, "totalReports": 0, "status": "clean"},
        "shodan": {"ports": [80, 443], "vulnerabilities": [], "status": "clean"}
    }
    
    # Simple mock simulation: If target is "evil.com", simulate bad reputation
    if "evil" in target.lower() or "malware" in target.lower() or "hack" in target.lower():
        result["virustotal"]["malicious"] = 12
        result["virustotal"]["status"] = "malicious"
        result["abuseipdb"]["abuseConfidenceScore"] = 85
        result["abuseipdb"]["status"] = "malicious"
        result["shodan"]["vulnerabilities"] = ["CVE-2021-44228", "CVE-2014-0160"]
        result["shodan"]["status"] = "vulnerable"

    return result
