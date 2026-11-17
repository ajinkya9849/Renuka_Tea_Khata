import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api_router import api_router
from app.db.session import SessionLocal
from app.db.init_db import init_db

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("renuka_chai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Renuka Chai Centre database and models...")
    db = SessionLocal()
    try:
        init_db(db)
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
    finally:
        db.close()
    yield
    logger.info("Shutting down Renuka Chai Centre application...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Khata Management Application backend for Renuka Chai Centre",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "app": "Renuka Chai Centre API",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
