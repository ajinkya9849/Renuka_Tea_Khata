from decimal import Decimal
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate

class CustomerService:
    @staticmethod
    def create_customer(db: Session, user_id: int, data: CustomerCreate) -> Customer:
        customer = Customer(
            user_id=user_id,
            name=data.name.strip(),
            phone=data.phone.strip() if data.phone else None,
            rate_per_cup=Decimal(str(data.rate_per_cup)),
            total_cups=0,
            total_amount=Decimal("0.00"),
            total_paid=Decimal("0.00"),
            outstanding_balance=Decimal("0.00")
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    @staticmethod
    def get_customer(db: Session, user_id: int, customer_id: int) -> Optional[Customer]:
        return db.query(Customer).filter(Customer.id == customer_id, Customer.user_id == user_id).first()

    @staticmethod
    def list_customers(
        db: Session, 
        user_id: int, 
        search: Optional[str] = None, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[Customer], int]:
        query = db.query(Customer).filter(Customer.user_id == user_id)
        if search and search.strip():
            term = f"%{search.strip().lower()}%"
            query = query.filter(
                or_(
                    func.lower(Customer.name).like(term),
                    Customer.phone.like(term)
                )
            )
        total = query.count()
        # Sort customers with outstanding balance first, then by name
        customers = query.order_by(Customer.outstanding_balance.desc(), Customer.name.asc()).offset(skip).limit(limit).all()
        return customers, total

    @staticmethod
    def update_customer(
        db: Session, 
        user_id: int, 
        customer_id: int, 
        data: CustomerUpdate
    ) -> Optional[Customer]:
        customer = CustomerService.get_customer(db, user_id, customer_id)
        if not customer:
            return None
        if data.name is not None:
            customer.name = data.name.strip()
        if data.phone is not None:
            customer.phone = data.phone.strip() if data.phone else None
        if data.rate_per_cup is not None:
            customer.rate_per_cup = Decimal(str(data.rate_per_cup))
        db.commit()
        db.refresh(customer)
        return customer

    @staticmethod
    def delete_customer(db: Session, user_id: int, customer_id: int) -> bool:
        customer = CustomerService.get_customer(db, user_id, customer_id)
        if not customer:
            return False
        db.delete(customer)
        db.commit()
        return True
