from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional, List, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.models.transaction import Transaction, TransactionType
from app.schemas.transaction import ChaiEntryCreate, PaymentCreate

class TransactionService:
    @staticmethod
    def add_chai_entry(
        db: Session, 
        user_id: int, 
        customer_id: int, 
        data: ChaiEntryCreate
    ) -> Transaction:
        customer = db.query(Customer).filter(
            Customer.id == customer_id, 
            Customer.user_id == user_id
        ).with_for_update().first()

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Customer not found"
            )

        if data.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Chai quantity must be at least 1"
            )

        rate = Decimal(str(data.rate_per_cup)) if data.rate_per_cup is not None else customer.rate_per_cup
        if rate <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Rate per cup must be greater than zero"
            )

        amount = Decimal(data.quantity) * rate
        balance_before = customer.outstanding_balance
        balance_after = balance_before + amount

        # Update customer cumulative statistics and outstanding balance
        customer.total_cups += data.quantity
        customer.total_amount += amount
        customer.outstanding_balance = balance_after

        transaction = Transaction(
            user_id=user_id,
            customer_id=customer_id,
            transaction_type=TransactionType.CHAI_ENTRY.value,
            quantity=data.quantity,
            rate_per_cup=rate,
            amount=amount,
            balance_before=balance_before,
            balance_after=balance_after,
            notes=data.notes,
            transaction_date=datetime.now(timezone.utc)
        )

        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        db.refresh(customer)
        return transaction

    @staticmethod
    def receive_payment(
        db: Session, 
        user_id: int, 
        customer_id: int, 
        data: PaymentCreate
    ) -> Transaction:
        customer = db.query(Customer).filter(
            Customer.id == customer_id, 
            Customer.user_id == user_id
        ).with_for_update().first()

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Customer not found"
            )

        payment_amount = Decimal(str(data.amount))
        if payment_amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Payment amount must be greater than zero"
            )

        if payment_amount > customer.outstanding_balance:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Payment amount (₹{payment_amount}) exceeds outstanding balance (₹{customer.outstanding_balance})"
            )

        balance_before = customer.outstanding_balance
        balance_after = balance_before - payment_amount

        # Update customer totals
        customer.total_paid += payment_amount
        customer.outstanding_balance = balance_after

        transaction = Transaction(
            user_id=user_id,
            customer_id=customer_id,
            transaction_type=TransactionType.PAYMENT.value,
            quantity=None,
            rate_per_cup=None,
            amount=payment_amount,
            balance_before=balance_before,
            balance_after=balance_after,
            notes=data.notes,
            transaction_date=datetime.now(timezone.utc)
        )

        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        db.refresh(customer)
        return transaction

    @staticmethod
    def get_customer_transactions(
        db: Session, 
        user_id: int, 
        customer_id: int, 
        filter_type: Optional[str] = None, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[Transaction], int]:
        query = db.query(Transaction).filter(
            Transaction.customer_id == customer_id, 
            Transaction.user_id == user_id
        )

        if filter_type and filter_type.upper() in ["CHAI_ENTRY", "PAYMENT"]:
            query = query.filter(Transaction.transaction_type == filter_type.upper())

        total = query.count()
        transactions = query.order_by(Transaction.transaction_date.desc(), Transaction.id.desc()).offset(skip).limit(limit).all()
        return transactions, total
