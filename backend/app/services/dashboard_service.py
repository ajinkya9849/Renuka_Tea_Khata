from datetime import datetime, time, timezone
from decimal import Decimal
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.customer import Customer
from app.models.transaction import Transaction, TransactionType
from app.schemas.dashboard import DashboardSummaryResponse, TodayTransactionItem

class DashboardService:
    @staticmethod
    def get_summary(db: Session, user_id: int) -> DashboardSummaryResponse:
        # Calculate today's start and end timestamps in UTC
        now = datetime.now(timezone.utc)
        today_start = datetime.combine(now.date(), time.min).replace(tzinfo=timezone.utc)
        today_end = datetime.combine(now.date(), time.max).replace(tzinfo=timezone.utc)

        # Aggregate today's chai entries
        today_chai_stats = db.query(
            func.coalesce(func.sum(Transaction.quantity), 0).label("total_cups"),
            func.coalesce(func.sum(Transaction.amount), Decimal("0.00")).label("total_amount")
        ).filter(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.CHAI_ENTRY.value,
            Transaction.transaction_date >= today_start,
            Transaction.transaction_date <= today_end
        ).first()

        today_cups = int(today_chai_stats.total_cups) if today_chai_stats else 0
        today_amount = Decimal(str(today_chai_stats.total_amount)) if today_chai_stats else Decimal("0.00")

        # Aggregate customer metrics
        customer_stats = db.query(
            func.count(Customer.id).label("total_customers"),
            func.coalesce(func.sum(Customer.outstanding_balance), Decimal("0.00")).label("total_outstanding")
        ).filter(Customer.user_id == user_id).first()

        total_customers = int(customer_stats.total_customers) if customer_stats else 0
        total_outstanding = Decimal(str(customer_stats.total_outstanding)) if customer_stats else Decimal("0.00")

        return DashboardSummaryResponse(
            today_chai_count=today_cups,
            today_amount=today_amount,
            total_customers=total_customers,
            total_outstanding_amount=total_outstanding
        )

    @staticmethod
    def get_today_transactions(db: Session, user_id: int, limit: int = 50) -> List[TodayTransactionItem]:
        now = datetime.now(timezone.utc)
        today_start = datetime.combine(now.date(), time.min).replace(tzinfo=timezone.utc)

        results = db.query(
            Transaction,
            Customer.name.label("customer_name")
        ).join(
            Customer, Transaction.customer_id == Customer.id
        ).filter(
            Transaction.user_id == user_id,
            Transaction.transaction_date >= today_start
        ).order_by(
            Transaction.transaction_date.desc(),
            Transaction.id.desc()
        ).limit(limit).all()

        items = []
        for tx, cust_name in results:
            items.append(TodayTransactionItem(
                id=tx.id,
                customer_id=tx.customer_id,
                customer_name=cust_name,
                transaction_type=tx.transaction_type,
                quantity=tx.quantity,
                amount=tx.amount,
                balance_after=tx.balance_after,
                transaction_date=tx.transaction_date
            ))
        return items

    @staticmethod
    def get_outstanding_customers(db: Session, user_id: int, limit: int = 20) -> List[Customer]:
        return db.query(Customer).filter(
            Customer.user_id == user_id,
            Customer.outstanding_balance > 0
        ).order_by(
            Customer.outstanding_balance.desc()
        ).limit(limit).all()
