from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.reports import DailyReportResponse, MonthlyReportResponse, CustomerLedgerResponse
from app.services.reports_service import ReportsService

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/daily", response_model=DailyReportResponse)
def get_daily_reports(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ReportsService.get_daily_report(db, current_user.id, days=days)

@router.get("/monthly", response_model=MonthlyReportResponse)
def get_monthly_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ReportsService.get_monthly_report(db, current_user.id)

@router.get("/customer-ledger/{customer_id}", response_model=CustomerLedgerResponse)
def get_customer_ledger(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ReportsService.get_customer_ledger(db, current_user.id, customer_id)
