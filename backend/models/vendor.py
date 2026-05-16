from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base

class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    target = Column(String, index=True, nullable=False) # Domain or IP
    company_name = Column(String, nullable=True)
    
    overall_score = Column(Float, nullable=False)
    severity_classification = Column(String, nullable=False) # Low, Medium, High, Critical
    
    # Detailed JSON results
    dns_analysis = Column(JSONB, nullable=True)
    ssl_analysis = Column(JSONB, nullable=True)
    headers_analysis = Column(JSONB, nullable=True)
    port_scan = Column(JSONB, nullable=True)
    reputation_check = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="scans")
