from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False, index=True)
    phone = Column(String(20), nullable=True, index=True)
    rate_per_cup = Column(Numeric(10, 2), default=10.00, nullable=False)
    total_cups = Column(Integer, default=0, nullable=False)
    total_amount = Column(Numeric(10, 2), default=0.00, nullable=False)
    total_paid = Column(Numeric(10, 2), default=0.00, nullable=False)
    outstanding_balance = Column(Numeric(10, 2), default=0.00, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="customers")
    transactions = relationship("Transaction", back_populates="customer", cascade="all, delete-orphan", order_by="desc(Transaction.transaction_date)")
