from datetime import datetime, timedelta, timezone
from decimal import Decimal
import logging
from sqlalchemy.orm import Session
from app.db.session import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.customer import Customer
from app.models.transaction import Transaction, TransactionType

logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)

    # Check if demo user already exists
    demo_email = "owner@renukachai.com"
    user = db.query(User).filter(User.email == demo_email).first()

    if not user:
        logger.info("Seeding initial Renuka Chai Centre shop owner and sample customers...")
        user = User(
            name="Renuka Admin",
            email=demo_email,
            password_hash=get_password_hash("password123"),
            shop_name="Renuka Chai Centre"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Seed sample customers from reference design
        now = datetime.now(timezone.utc)

        # 1. Sumeet Kiran (35 cups, ₹250 due)
        sumeet = Customer(
            user_id=user.id,
            name="Sumeet Kiran",
            phone="9876543210",
            rate_per_cup=Decimal("10.00"),
            total_cups=35,
            total_amount=Decimal("350.00"),
            total_paid=Decimal("100.00"),
            outstanding_balance=Decimal("250.00"),
            created_at=now - timedelta(days=15)
        )
        db.add(sumeet)

        # 2. Subhash Store (12 cups, ₹120 due)
        subhash = Customer(
            user_id=user.id,
            name="Subhash Store",
            phone="9811223344",
            rate_per_cup=Decimal("10.00"),
            total_cups=12,
            total_amount=Decimal("120.00"),
            total_paid=Decimal("0.00"),
            outstanding_balance=Decimal("120.00"),
            created_at=now - timedelta(days=10)
        )
        db.add(subhash)

        # 3. Rahul Tea Stall (18 cups, Settled)
        rahul = Customer(
            user_id=user.id,
            name="Rahul Tea Stall",
            phone="9844556677",
            rate_per_cup=Decimal("10.00"),
            total_cups=18,
            total_amount=Decimal("180.00"),
            total_paid=Decimal("180.00"),
            outstanding_balance=Decimal("0.00"),
            created_at=now - timedelta(days=8)
        )
        db.add(rahul)

        # 4. Aman General (9 cups, ₹90 due)
        aman = Customer(
            user_id=user.id,
            name="Aman General",
            phone="9899887766",
            rate_per_cup=Decimal("10.00"),
            total_cups=9,
            total_amount=Decimal("90.00"),
            total_paid=Decimal("0.00"),
            outstanding_balance=Decimal("90.00"),
            created_at=now - timedelta(days=5)
        )
        db.add(aman)

        db.commit()
        db.refresh(sumeet)
        db.refresh(subhash)
        db.refresh(rahul)
        db.refresh(aman)

        # Seed sample transactions for Sumeet Kiran matching reference history
        tx1 = Transaction(
            user_id=user.id,
            customer_id=sumeet.id,
            transaction_type=TransactionType.CHAI_ENTRY.value,
            quantity=9,
            rate_per_cup=Decimal("10.00"),
            amount=Decimal("90.00"),
            balance_before=Decimal("200.00"),
            balance_after=Decimal("290.00"),
            notes="Evening order",
            transaction_date=now - timedelta(days=2, hours=3)
        )
        tx2 = Transaction(
            user_id=user.id,
            customer_id=sumeet.id,
            transaction_type=TransactionType.CHAI_ENTRY.value,
            quantity=4,
            rate_per_cup=Decimal("10.00"),
            amount=Decimal("40.00"),
            balance_before=Decimal("290.00"),
            balance_after=Decimal("330.00"),
            notes="Morning batch",
            transaction_date=now - timedelta(days=1, hours=2)
        )
        tx3 = Transaction(
            user_id=user.id,
            customer_id=sumeet.id,
            transaction_type=TransactionType.CHAI_ENTRY.value,
            quantity=6,
            rate_per_cup=Decimal("10.00"),
            amount=Decimal("60.00"),
            balance_before=Decimal("330.00"),
            balance_after=Decimal("390.00"),
            notes="Special ginger tea",
            transaction_date=now - timedelta(hours=1)
        )
        tx4 = Transaction(
            user_id=user.id,
            customer_id=sumeet.id,
            transaction_type=TransactionType.PAYMENT.value,
            quantity=None,
            rate_per_cup=None,
            amount=Decimal("100.00"),
            balance_before=Decimal("350.00"),
            balance_after=Decimal("250.00"),
            notes="UPI Google Pay",
            transaction_date=now - timedelta(minutes=45)
        )
        db.add_all([tx1, tx2, tx3, tx4])

        # Seed today's transaction for Subhash & Aman so today's stats show up realistically
        tx_subhash = Transaction(
            user_id=user.id,
            customer_id=subhash.id,
            transaction_type=TransactionType.CHAI_ENTRY.value,
            quantity=12,
            rate_per_cup=Decimal("10.00"),
            amount=Decimal("120.00"),
            balance_before=Decimal("0.00"),
            balance_after=Decimal("120.00"),
            notes="Morning supply",
            transaction_date=now - timedelta(hours=3)
        )
        tx_aman = Transaction(
            user_id=user.id,
            customer_id=aman.id,
            transaction_type=TransactionType.CHAI_ENTRY.value,
            quantity=9,
            rate_per_cup=Decimal("10.00"),
            amount=Decimal("90.00"),
            balance_before=Decimal("0.00"),
            balance_after=Decimal("90.00"),
            notes="Afternoon order",
            transaction_date=now - timedelta(hours=2)
        )
        # Seed Rahul today chai entry & payment
        tx_rahul_chai = Transaction(
            user_id=user.id,
            customer_id=rahul.id,
            transaction_type=TransactionType.CHAI_ENTRY.value,
            quantity=18,
            rate_per_cup=Decimal("10.00"),
            amount=Decimal("180.00"),
            balance_before=Decimal("0.00"),
            balance_after=Decimal("180.00"),
            notes="Shop order",
            transaction_date=now - timedelta(hours=4)
        )
        tx_rahul_pay = Transaction(
            user_id=user.id,
            customer_id=rahul.id,
            transaction_type=TransactionType.PAYMENT.value,
            quantity=None,
            rate_per_cup=None,
            amount=Decimal("180.00"),
            balance_before=Decimal("180.00"),
            balance_after=Decimal("0.00"),
            notes="Full cash payment",
            transaction_date=now - timedelta(hours=1, minutes=15)
        )
        db.add_all([tx_subhash, tx_aman, tx_rahul_chai, tx_rahul_pay])

        db.commit()
        logger.info("Sample seed data committed successfully.")
