# Renuka Chai Centre — Complete Khata Management Application

![Renuka Chai Centre](frontend/public/favicon.svg)

A complete, production-ready, ultra-fast Khata Management Application engineered specifically for chai shop owners to effortlessly maintain daily customer entries, chai cup counts, outstanding balances, and payment collections.

---

## ☕ Key Highlights

- **Exact Reference UI Implementation:** Modern iOS-inspired mobile interface crafted with warm cafe aesthetics, soft beige cards (`#FBEBDD`), rich coffee brown tones (`#5B2D16`), caramel orange highlights (`#C45A0A`), and cream background (`#FFF6EC`).
- **Instant Customer Search:** Instant debounced lookup by customer name, phone number, or partial match.
- **Fast Chai Entry (2–3 Taps):** Big stepper (`-` / `+`), quick presets (`+1, +2, +4, +6, +9, +15`), editable rate per cup, and real-time amount calculation (`Quantity × Rate`).
- **Dynamic Balance Engine:** Atomically updates customer cup totals, cumulative amounts, and balance due without requiring a full page refresh.
- **Payment Collection & Settlement:** Fast payment intake with quick amounts (`₹50, ₹100, ₹200, ₹500, Full Due`), remaining balance preview, and strict validation preventing overpayments or negative balances.
- **Customer Transaction History:** Complete ledger with filter tabs (*All*, *Chai Centre*, *Payment*), timestamps, amounts, and running balances.
- **1-Click Shop Owner Demo Login:** Pre-seeded with sample customers matching the reference design (*Sumeet Kiran*, *Subhash Store*, *Rahul Tea Stall*, *Aman General*).

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18+ with TypeScript & Vite
- **Styling:** Vanilla Tailwind CSS with custom cafe design tokens
- **Icons:** Lucide React
- **Routing:** React Router DOM (v7)
- **State Management:** Zustand
- **HTTP Client:** Axios with JWT Bearer interceptor
- **Validation:** React Hook Form + Zod

### Backend
- **Framework:** Python 3.12+ / FastAPI
- **ORM:** SQLAlchemy 2.0 (with connection pooling)
- **Database:** PostgreSQL 16
- **Migrations:** Alembic
- **Validation:** Pydantic v2
- **Authentication:** JWT (JSON Web Tokens) with Argon2/bcrypt password hashing

### Deployment & DevOps
- Docker & Docker Compose
- Nginx Reverse Proxy (SPA routing + gzip compression)

---

## 🎨 Cafe Color Palette & Design Tokens

| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| **Primary Coffee Brown** | `#5B2D16` | Main branding, primary action buttons, active tabs |
| **Dark Espresso** | `#321707` | Hover states, dark accents, logo gradients |
| **Caramel Orange** | `#C45A0A` | Accent highlights, search icons, subtle steam |
| **Cream Background** | `#FFF6EC` | Core warm background across all screens |
| **Soft Beige Cards** | `#FBEBDD` | Rounded card containers & input fills |
| **Light Peach** | `#FFE7CC` | Avatar initials badges, stat pill backgrounds |
| **Green Success** | `#16803C` | Payment collections, settled status badges |
| **Red Outstanding** | `#DC2626` | Due amounts, balance alerts |
| **Primary Text** | `#181818` | High-contrast readable typography |
| **Secondary Text** | `#6B7280` | Subtitles, timestamps, and metadata |

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

1. Clone or navigate to the repository:
   ```bash
   cd /Users/apple/Desktop/Renuka-Tea
   ```

2. Start all services (PostgreSQL + FastAPI Backend + React Nginx Frontend):
   ```bash
   docker compose up --build
   ```

3. Open your browser:
   - **Frontend App:** [http://localhost:3000](http://localhost:3000) (or `http://localhost:5173` in dev mode)
   - **FastAPI Interactive Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Backend Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### Option 2: Local Development Setup

#### 1. Database (PostgreSQL)
Ensure PostgreSQL is running. You can run the Dockerized PostgreSQL container:
```bash
docker run -d --name renuka_postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=renuka_chai -p 5434:5432 postgres:16-alpine
```

#### 2. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Note: On initial startup, the database automatically initializes tables and seeds the demo shop owner with sample customers.*

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Default Login Credentials

- **1-Click Demo Login:** Simply click **"Instant Login as Shop Owner"** on the login screen.
- **Manual Credentials:**
  - **Email:** `owner@renukachai.com`
  - **Password:** `password123`

---

## 📊 Sample Pre-seeded Customers

| Customer Name | Cups | Outstanding Balance | Status |
| :--- | :--- | :--- | :--- |
| **Sumeet Kiran** | 35 cups | ₹250.00 | Due |
| **Subhash Store** | 12 cups | ₹120.00 | Due |
| **Rahul Tea Stall** | 18 cups | ₹0.00 | Settled |
| **Aman General** | 9 cups | ₹90.00 | Due |

---

## 🧪 Testing the Application

### Running Backend Unit & Integration Tests:
```bash
cd backend
PYTHONPATH=. ./.venv/bin/pytest tests/ -v
```
All tests verify:
- Authentication & JWT issuance
- Customer search & partial name matching
- Atomic chai entry creation and amount calculation
- Payment processing, balance deductions, and overpayment prevention
- Daily & customer ledger reports

### Building the Frontend Production Bundle:
```bash
cd frontend
npm run build
```

---

## 📁 Project Structure

```
Renuka-Tea/
├── backend/
│   ├── alembic/              # Database migration scripts
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/       # Auth, Customers, Transactions, Dashboard, Reports
│   │   │   ├── api_router.py
│   │   │   └── deps.py       # DB & JWT Auth dependencies
│   │   ├── core/             # Settings, JWT & security helpers
│   │   ├── db/               # SQLAlchemy engine, session & seeder
│   │   ├── models/           # User, Customer, Transaction models
│   │   ├── schemas/          # Pydantic v2 validation models
│   │   ├── services/         # Business logic layer
│   │   └── main.py           # FastAPI entrypoint
│   ├── tests/                # Automated pytest suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── public/               # Favicon & assets
│   ├── src/
│   │   ├── components/       # Header, Cards, Modals, Forms, BottomNav
│   │   ├── layouts/          # Mobile shell AppLayout
│   │   ├── pages/            # HomePage, CustomerDetailsPage, Reports, Settings, Login
│   │   ├── services/         # Axios API client
│   │   ├── store/            # Zustand auth and khata state stores
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # Currency and time formatters
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml
├── nginx.conf
├── .env.example
├── .env
└── README.md
```

---

## 📄 License
MIT License. Built for Renuka Chai Centre.
