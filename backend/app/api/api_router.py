from fastapi import APIRouter
from app.api.routes import auth, customers, transactions, dashboard, reports

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(customers.router)
api_router.include_router(transactions.router)
api_router.include_router(dashboard.router)
api_router.include_router(reports.router)
