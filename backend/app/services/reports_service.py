from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from fastapi import HTTPException, status
from app.models.customer import Customer
from app.models.transaction import Transaction, TransactionType
from app.schemas.reports import (
    DailyReportResponse, DailyReportItem,
    MonthlyReportResponse, MonthlyReportItem,
    CustomerLedgerResponse, LedgerEntryItem
)
from app.schemas.customer import CustomerResponse

class ReportsService:
    @staticmethod
    def get_daily_report(db: Session, user_id: int, days: int = 30) -> DailyReportResponse:
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        transactions = db.query(
            cast(Transaction.transaction_date, Date).label("day"),
            Transaction.transaction_type,
            func.coalesce(func.sum(Transaction.quantity), 0).label("cups"),
            func.coalesce(func.sum(Transaction.amount), Decimal("0.00")).label("amt")
        ).filter(
            Transaction.user_id == user_id,
            Transaction.transaction_date >= start_date
        ).group_by(
            cast(Transaction.transaction_date, Date),
            Transaction.transaction_type
        ).all()

        daily_map: Dict[str, Dict] = {}
        total_cups = 0
        total_sales = Decimal("0.00")
        total_collected = Decimal("0.00")

        for row in transactions:
            day_str = str(row.day)
            if day_str not in daily_map:
                daily_map[day_str] = {
                    "report_date": row.day,
                    "cups": 0,
                    "sales": Decimal("0.00"),
                    "collected": Decimal("0.00")
                }
            if row.transaction_type == TransactionType.CHAI_ENTRY.value:
                cups = int(row.cups)
                amt = Decimal(str(row.amt))
                daily_map[day_str]["cups"] += cups
                daily_map[day_str]["sales"] += amt
                total_cups += cups
                total_sales += amt
            elif row.transaction_type == TransactionType.PAYMENT.value:
                amt = Decimal(str(row.amt))
                daily_map[day_str]["collected"] += amt
                total_collected += amt

        items = []
        for day_str in sorted(daily_map.keys(), reverse=True):
            d = daily_map[day_str]
            net = d["sales"] - d["collected"]
            items.append(DailyReportItem(
                report_date=d["report_date"],
                total_cups=d["cups"],
                chai_sales_amount=d["sales"],
                payments_collected=d["collected"],
                net_change=net
            ))

        return DailyReportResponse(
            items=items,
            total_cups=total_cups,
            total_sales=total_sales,
            total_collected=total_collected
        )

    @staticmethod
    def get_monthly_report(db: Session, user_id: int) -> MonthlyReportResponse:
        transactions = db.query(
            Transaction.transaction_date,
            Transaction.transaction_type,
            Transaction.quantity,
            Transaction.amount
        ).filter(Transaction.user_id == user_id).all()

        months_map: Dict[str, Dict] = {}
        for tx in transactions:
            m_key = tx.transaction_date.strftime("%B %Y")
            if m_key not in months_map:
                months_map[m_key] = {"month": m_key, "cups": 0, "sales": Decimal("0.00"), "collected": Decimal("0.00")}
            if tx.transaction_type == TransactionType.CHAI_ENTRY.value:
                months_map[m_key]["cups"] += (tx.quantity or 0)
                months_map[m_key]["sales"] += tx.amount
            elif tx.transaction_type == TransactionType.PAYMENT.value:
                months_map[m_key]["collected"] += tx.amount

        items = [
            MonthlyReportItem(
                month=v["month"],
                total_cups=v["cups"],
                total_sales=v["sales"],
                total_collected=v["collected"]
            )
            for v in months_map.values()
        ]
        return MonthlyReportResponse(items=items)

    @staticmethod
    def get_customer_ledger(db: Session, user_id: int, customer_id: int) -> CustomerLedgerResponse:
        customer = db.query(Customer).filter(
            Customer.id == customer_id,
            Customer.user_id == user_id
        ).first()

        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

        txs = db.query(Transaction).filter(
            Transaction.customer_id == customer_id,
            Transaction.user_id == user_id
        ).order_by(Transaction.transaction_date.asc(), Transaction.id.asc()).all()

        entries: List[LedgerEntryItem] = []
        total_debit = Decimal("0.00")
        total_credit = Decimal("0.00")

        for tx in txs:
            if tx.transaction_type == TransactionType.CHAI_ENTRY.value:
                debit = tx.amount
                credit = Decimal("0.00")
                total_debit += debit
                desc = f"{tx.quantity} cups @ ₹{tx.rate_per_cup}/cup"
            else:
                debit = Decimal("0.00")
                credit = tx.amount
                total_credit += credit
                desc = "Payment Received"

            entries.append(LedgerEntryItem(
                id=tx.id,
                transaction_date=tx.transaction_date,
                transaction_type=tx.transaction_type,
                description=desc,
                quantity=tx.quantity,
                rate_per_cup=tx.rate_per_cup,
                debit=debit,
                credit=credit,
                balance=tx.balance_after
            ))

        # Reverse entries for display (newest first)
        entries.reverse()

        return CustomerLedgerResponse(
            customer=CustomerResponse.model_validate(customer),
            entries=entries,
            total_debit=total_debit,
            total_credit=total_credit,
            closing_balance=customer.outstanding_balance
        )
