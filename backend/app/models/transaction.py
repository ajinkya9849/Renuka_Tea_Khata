import enum
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class TransactionType(str, enum.Enum):
    CHAI_ENTRY = "CHAI_ENTRY"
    PAYMENT = "PAYMENT"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    transaction_type = Column(String(20), nullable=False, index=True)
    quantity = Column(Integer, nullable=True)
    rate_per_cup = Column(Numeric(10, 2), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    balance_before = Column(Numeric(10, 2), nullable=False)
    balance_after = Column(Numeric(10, 2), nullable=False)
    notes = Column(Text, nullable=True)
    transaction_date = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="transactions")
    customer = relationship("Customer", back_populates="transactions")
