import httpx

async def scan_headers(target: str) -> dict:
    result = {
        "reachable": False,
        "status_code": None,
        "headers": {},
        "missing_security_headers": []
    }
    
    url = target if target.startswith("http") else f"https://{target}"
    
    security_headers = [
        "Content-Security-Policy",
        "Strict-Transport-Security",
        "X-Frame-Options",
        "X-Content-Type-Options",
        "Referrer-Policy"
    ]
    
    try:
        async with httpx.AsyncClient(verify=False, timeout=5.0) as client:
            response = await client.get(url)
            result["reachable"] = True
            result["status_code"] = response.status_code
            
            headers_lower = {k.lower(): v for k, v in response.headers.items()}
            
            for h in security_headers:
                if h.lower() in headers_lower:
                    result["headers"][h] = headers_lower[h.lower()]
                else:
                    result["missing_security_headers"].append(h)
                    
    except Exception as e:
        pass
        
    return result
