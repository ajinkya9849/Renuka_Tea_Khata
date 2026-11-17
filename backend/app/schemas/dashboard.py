from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel

class DashboardSummaryResponse(BaseModel):
    today_chai_count: int
    today_amount: Decimal
    total_customers: int
    total_outstanding_amount: Decimal

class TodayTransactionItem(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    transaction_type: str
    quantity: Optional[int] = None
    amount: Decimal
    balance_after: Decimal
    transaction_date: datetime

class DashboardTodayResponse(BaseModel):
    transactions: List[TodayTransactionItem]
