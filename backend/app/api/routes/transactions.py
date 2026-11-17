from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.transaction import (
    ChaiEntryCreate, 
    PaymentCreate, 
    TransactionResponse, 
    TransactionListResponse
)
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/customers/{customer_id}", tags=["Transactions"])

@router.post("/chai-entry", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def add_chai_entry(
    customer_id: int,
    data: ChaiEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TransactionService.add_chai_entry(db, current_user.id, customer_id, data)

@router.get("/transactions", response_model=TransactionListResponse)
def get_customer_transactions(
    customer_id: int,
    type: Optional[str] = Query(None, description="Filter: ALL, CHAI_ENTRY, or PAYMENT"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items, total = TransactionService.get_customer_transactions(
        db, current_user.id, customer_id, filter_type=type, skip=skip, limit=limit
    )
    return TransactionListResponse(items=items, total=total)

@router.post("/payment", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def receive_payment(
    customer_id: int,
    data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TransactionService.receive_payment(db, current_user.id, customer_id, data)

@router.get("/payments", response_model=TransactionListResponse)
def get_customer_payments(
    customer_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items, total = TransactionService.get_customer_transactions(
        db, current_user.id, customer_id, filter_type="PAYMENT", skip=skip, limit=limit
    )
    return TransactionListResponse(items=items, total=total)
