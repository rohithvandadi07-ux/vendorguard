def calculate_risk_score(
    dns: dict, ssl: dict, headers: dict, ports: dict, reputation: dict
) -> tuple[float, str]:
    # Start with a perfect score
    score = 100.0
    
    # SSL/TLS Deductions
    if not ssl.get("valid", False):
        score -= 40
    if ssl.get("expired", False):
        score -= 20
        
    # Headers Deductions
    missing_headers = headers.get("missing_security_headers", [])
    score -= len(missing_headers) * 5
    
    # Port Scan Deductions
    if ports.get("risky_ports_exposed", False):
        # Subtract for every risky port
        open_ports = ports.get("open_ports", [])
        risky_count = len([p for p in open_ports if p["port"] not in [80, 443]])
        score -= risky_count * 10
        
    # Reputation Deductions
    vt_malicious = reputation.get("virustotal", {}).get("malicious", 0)
    if vt_malicious > 0:
        score -= min(vt_malicious * 10, 50)
        
    abuse_score = reputation.get("abuseipdb", {}).get("abuseConfidenceScore", 0)
    if abuse_score > 0:
        score -= min(abuse_score * 0.5, 30)
        
    shodan_vulns = reputation.get("shodan", {}).get("vulnerabilities", [])
    if shodan_vulns:
        score -= len(shodan_vulns) * 15

    # Ensure score is within 0-100 bounds
    score = max(0.0, min(100.0, score))
    
    # Classify severity (Note: Lower score means higher risk. Alternatively, we can define Risk Score as 0=Good, 100=Bad.
    # Standard practice often uses 0-100 where 100 is excellent security posture. Let's stick to this.)
    
    if score >= 85:
        severity = "Low"
    elif score >= 60:
        severity = "Medium"
    elif score >= 35:
        severity = "High"
    else:
        severity = "Critical"
        
    return round(score, 1), severity
