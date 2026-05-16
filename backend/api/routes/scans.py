from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.session import get_db
from models.user import User
from models.vendor import ScanResult
from schemas.vendor import ScanRequest, ScanResponse
from api.deps import get_current_user

# Scanners
from services.dns_scanner import scan_dns
from services.ssl_scanner import scan_ssl
from services.headers_scanner import scan_headers
from services.port_scanner import scan_ports
from services.reputation import check_reputation
from services.scoring import calculate_risk_score

router = APIRouter()

@router.post("/run", response_model=ScanResponse)
async def run_scan(
    scan_request: ScanRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    target = scan_request.target
    
    # Run scanners concurrently (or sequentially for simplicity in this demo, some are async)
    dns_res = scan_dns(target)
    ssl_res = scan_ssl(target)
    headers_res = await scan_headers(target)
    ports_res = await scan_ports(target)
    rep_res = await check_reputation(target)
    
    # Calculate score
    score, severity = calculate_risk_score(dns_res, ssl_res, headers_res, ports_res, rep_res)
    
    # Save to db
    db_scan = ScanResult(
        target=target,
        company_name=scan_request.company_name,
        overall_score=score,
        severity_classification=severity,
        dns_analysis=dns_res,
        ssl_analysis=ssl_res,
        headers_analysis=headers_res,
        port_scan=ports_res,
        reputation_check=rep_res,
        owner_id=current_user.id
    )
    
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    return db_scan

@router.get("/history", response_model=List[ScanResponse])
def get_scan_history(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    scans = db.query(ScanResult).filter(ScanResult.owner_id == current_user.id).order_by(ScanResult.created_at.desc()).offset(skip).limit(limit).all()
    return scans

@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan_details(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scan = db.query(ScanResult).filter(ScanResult.id == scan_id, ScanResult.owner_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan
