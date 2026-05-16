import whois
import socket

def scan_dns(target: str) -> dict:
    result = {
        "domain": target,
        "whois_found": False,
        "registrar": None,
        "creation_date": None,
        "expiration_date": None,
        "ips": []
    }
    
    # Clean target (remove http/https if present)
    clean_target = target.replace("https://", "").replace("http://", "").split("/")[0]

    # IP Resolution
    try:
        ips = socket.gethostbyname_ex(clean_target)[2]
        result["ips"] = ips
    except Exception:
        pass

    # WHOIS
    try:
        w = whois.whois(clean_target)
        if w.domain_name:
            result["whois_found"] = True
            result["registrar"] = w.registrar
            
            # Handle list returns for dates
            creation = w.creation_date
            if isinstance(creation, list):
                creation = creation[0]
            result["creation_date"] = str(creation) if creation else None
            
            expiration = w.expiration_date
            if isinstance(expiration, list):
                expiration = expiration[0]
            result["expiration_date"] = str(expiration) if expiration else None
    except Exception:
        pass
        
    return result
