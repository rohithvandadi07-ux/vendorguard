from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

class ScanRequest(BaseModel):
    target: str
    company_name: Optional[str] = None

class ScanResponse(BaseModel):
    id: int
    target: str
    company_name: Optional[str] = None
    overall_score: float
    severity_classification: str
    dns_analysis: Optional[Dict[str, Any]] = None
    ssl_analysis: Optional[Dict[str, Any]] = None
    headers_analysis: Optional[Dict[str, Any]] = None
    port_scan: Optional[Dict[str, Any]] = None
    reputation_check: Optional[Dict[str, Any]] = None
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True
