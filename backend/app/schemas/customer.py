from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    rate_per_cup: Decimal = Field(default=Decimal("10.00"), gt=0)

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    rate_per_cup: Optional[Decimal] = Field(None, gt=0)

class CustomerResponse(CustomerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    total_cups: int
    total_amount: Decimal
    total_paid: Decimal
    outstanding_balance: Decimal
    created_at: datetime
    updated_at: datetime

class CustomerListResponse(BaseModel):
    items: List[CustomerResponse]
    total: int
