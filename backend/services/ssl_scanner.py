import ssl
import socket
from datetime import datetime

def scan_ssl(target: str) -> dict:
    result = {
        "valid": False,
        "issuer": None,
        "subject": None,
        "expired": False,
        "expires_on": None,
        "error": None
    }
    clean_target = target.replace("https://", "").replace("http://", "").split("/")[0]
    
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE # We just want to fetch it first
    
    try:
        with socket.create_connection((clean_target, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=clean_target) as ssock:
                cert = ssock.getpeercert(binary_form=True)
                # To actually parse the cert details easily without cryptography pkg overhead,
                # we can do a secondary check with CERT_REQUIRED
    except Exception as e:
        result["error"] = str(e)
        return result
        
    # Re-verify for actual validity
    context_verify = ssl.create_default_context()
    try:
        with socket.create_connection((clean_target, 443), timeout=5) as sock:
            with context_verify.wrap_socket(sock, server_hostname=clean_target) as ssock:
                cert = ssock.getpeercert()
                result["valid"] = True
                
                issuer = dict(x[0] for x in cert.get('issuer', []))
                subject = dict(x[0] for x in cert.get('subject', []))
                
                result["issuer"] = issuer.get('organizationName', 'Unknown')
                result["subject"] = subject.get('commonName', 'Unknown')
                
                not_after = cert.get('notAfter')
                if not_after:
                    expires_on = datetime.strptime(not_after, '%b %d %H:%M:%S %Y %Z')
                    result["expires_on"] = expires_on.isoformat()
                    result["expired"] = datetime.utcnow() > expires_on
                    
    except Exception as e:
        result["error"] = "Invalid or self-signed certificate"
        
    return result
