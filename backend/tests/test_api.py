import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.init_db import init_db

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    db = SessionLocal()
    init_db(db)
    db.close()

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_login():
    response = client.post("/api/auth/demo-login")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "owner@renukachai.com"
    return data["access_token"]

def test_get_dashboard_summary():
    # Login
    auth_resp = client.post("/api/auth/demo-login")
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/dashboard/summary", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "today_chai_count" in data
    assert "today_amount" in data
    assert "total_customers" in data
    assert data["total_customers"] >= 4

def test_search_customers():
    auth_resp = client.post("/api/auth/demo-login")
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/customers/search?q=Sumeet", headers=headers)
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    assert results[0]["name"] == "Sumeet Kiran"
    assert float(results[0]["outstanding_balance"]) == 250.00

def test_chai_entry_flow():
    auth_resp = client.post("/api/auth/demo-login")
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Find customer Sumeet Kiran
    search_resp = client.get("/api/customers/search?q=Sumeet", headers=headers)
    sumeet = search_resp.json()[0]
    initial_balance = float(sumeet["outstanding_balance"])
    initial_cups = sumeet["total_cups"]

    # Add 6 chai entry @ ₹10 = ₹60
    entry_payload = {
        "quantity": 6,
        "rate_per_cup": 10.00,
        "notes": "Test chai entry"
    }
    entry_resp = client.post(f"/api/customers/{sumeet['id']}/chai-entry", json=entry_payload, headers=headers)
    assert entry_resp.status_code == 201
    tx = entry_resp.json()
    assert tx["transaction_type"] == "CHAI_ENTRY"
    assert tx["quantity"] == 6
    assert float(tx["amount"]) == 60.00
    assert float(tx["balance_after"]) == initial_balance + 60.00

    # Verify customer updated
    cust_resp = client.get(f"/api/customers/{sumeet['id']}", headers=headers)
    updated_cust = cust_resp.json()
    assert updated_cust["total_cups"] == initial_cups + 6
    assert float(updated_cust["outstanding_balance"]) == initial_balance + 60.00

def test_payment_flow():
    auth_resp = client.post("/api/auth/demo-login")
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Find customer Sumeet Kiran
    search_resp = client.get("/api/customers/search?q=Sumeet", headers=headers)
    sumeet = search_resp.json()[0]
    current_balance = float(sumeet["outstanding_balance"])

    # Receive payment of ₹60
    pay_payload = {
        "amount": 60.00,
        "notes": "Test payment collection"
    }
    pay_resp = client.post(f"/api/customers/{sumeet['id']}/payment", json=pay_payload, headers=headers)
    assert pay_resp.status_code == 201
    tx = pay_resp.json()
    assert tx["transaction_type"] == "PAYMENT"
    assert float(tx["amount"]) == 60.00
    assert float(tx["balance_after"]) == current_balance - 60.00

def test_prevent_overpayment():
    auth_resp = client.post("/api/auth/demo-login")
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    search_resp = client.get("/api/customers/search?q=Sumeet", headers=headers)
    sumeet = search_resp.json()[0]
    current_balance = float(sumeet["outstanding_balance"])

    # Attempt to pay more than current balance
    excess_amount = current_balance + 500.00
    excess_resp = client.post(
        f"/api/customers/{sumeet['id']}/payment", 
        json={"amount": excess_amount}, 
        headers=headers
    )
    assert excess_resp.status_code == 400

def test_customer_ledger():
    auth_resp = client.post("/api/auth/demo-login")
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    search_resp = client.get("/api/customers/search?q=Sumeet", headers=headers)
    sumeet = search_resp.json()[0]

    ledger_resp = client.get(f"/api/reports/customer-ledger/{sumeet['id']}", headers=headers)
    assert ledger_resp.status_code == 200
    ledger = ledger_resp.json()
    assert "entries" in ledger
    assert len(ledger["entries"]) >= 2
    assert "closing_balance" in ledger
