from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.customer import CustomerResponse
from app.schemas.dashboard import DashboardSummaryResponse, TodayTransactionItem
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return DashboardService.get_summary(db, current_user.id)

@router.get("/today-transactions", response_model=List[TodayTransactionItem])
def get_today_transactions(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return DashboardService.get_today_transactions(db, current_user.id, limit=limit)

@router.get("/outstanding-customers", response_model=List[CustomerResponse])
def get_outstanding_customers(
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return DashboardService.get_outstanding_customers(db, current_user.id, limit=limit)
