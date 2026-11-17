from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.customer import CustomerResponse

class DailyReportItem(BaseModel):
    report_date: date
    total_cups: int
    chai_sales_amount: Decimal
    payments_collected: Decimal
    net_change: Decimal

class DailyReportResponse(BaseModel):
    items: List[DailyReportItem]
    total_cups: int
    total_sales: Decimal
    total_collected: Decimal

class MonthlyReportItem(BaseModel):
    month: str
    total_cups: int
    total_sales: Decimal
    total_collected: Decimal

class MonthlyReportResponse(BaseModel):
    items: List[MonthlyReportItem]

class LedgerEntryItem(BaseModel):
    id: int
    transaction_date: datetime
    transaction_type: str
    description: str
    quantity: Optional[int] = None
    rate_per_cup: Optional[Decimal] = None
    debit: Decimal  # Chai entry amount added to due
    credit: Decimal # Payment amount deducted from due
    balance: Decimal

class CustomerLedgerResponse(BaseModel):
    customer: CustomerResponse
    entries: List[LedgerEntryItem]
    total_debit: Decimal
    total_credit: Decimal
    closing_balance: Decimal
