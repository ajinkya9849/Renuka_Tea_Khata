from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class ChaiEntryCreate(BaseModel):
    quantity: int = Field(..., ge=1, description="Quantity of chai cups")
    rate_per_cup: Optional[Decimal] = Field(None, gt=0, description="Optional custom rate, defaults to customer saved rate")
    notes: Optional[str] = Field(None, max_length=255)

class PaymentCreate(BaseModel):
    amount: Decimal = Field(..., gt=0, description="Payment amount received")
    notes: Optional[str] = Field(None, max_length=255)

class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    customer_id: int
    transaction_type: str
    quantity: Optional[int] = None
    rate_per_cup: Optional[Decimal] = None
    amount: Decimal
    balance_before: Decimal
    balance_after: Decimal
    notes: Optional[str] = None
    transaction_date: datetime
    created_at: datetime

class TransactionListResponse(BaseModel):
    items: List[TransactionResponse]
    total: int
