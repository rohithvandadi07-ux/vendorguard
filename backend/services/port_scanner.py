import socket
import asyncio

async def check_port(target: str, port: int) -> bool:
    loop = asyncio.get_event_loop()
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setblocking(False)
    
    try:
        await asyncio.wait_for(loop.sock_connect(sock, (target, port)), timeout=1.0)
        return True
    except:
        return False
    finally:
        sock.close()

async def scan_ports(target: str) -> dict:
    clean_target = target.replace("https://", "").replace("http://", "").split("/")[0]
    
    common_ports = {
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        3306: "MySQL",
        3389: "RDP",
        5432: "PostgreSQL",
        27017: "MongoDB"
    }
    
    result = {
        "open_ports": [],
        "risky_ports_exposed": False
    }
    
    tasks = [check_port(clean_target, port) for port in common_ports.keys()]
    results = await asyncio.gather(*tasks)
    
    for port, is_open in zip(common_ports.keys(), results):
        if is_open:
            result["open_ports"].append({"port": port, "service": common_ports[port]})
            if port not in [80, 443]:
                result["risky_ports_exposed"] = True
                
    return result
