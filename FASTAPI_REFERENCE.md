# FastAPI Backend Reference
# This is a reference guide for setting up the FastAPI backend

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── alert.py           # Alert model
│   │   ├── subscription.py    # Subscription model
│   │   └── prediction.py      # Prediction model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── alert.py           # Pydantic schemas
│   │   ├── subscription.py
│   │   └── prediction.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── alerts.py          # Alert endpoints
│   │   ├── map.py             # Map endpoints
│   │   └── analytics.py       # Analytics endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ml_service.py      # ML prediction service
│   │   └── notification.py    # Email/SMS service
│   └── websockets/
│       ├── __init__.py
│       └── alerts.py          # WebSocket handlers
├── migrations/                 # Alembic migrations
├── requirements.txt
└── .env
```

## Sample main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import alerts, map, analytics
from app.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FloodWatch API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(map.router, prefix="/api/map", tags=["map"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

@app.get("/")
def read_root():
    return {"message": "FloodWatch API"}
```

## Sample database.py
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/floodwatch")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Sample models/alert.py
```python
from sqlalchemy import Column, Integer, String, Float, DateTime, func
from geoalchemy2 import Geometry
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String(255))
    latitude = Column(Float)
    longitude = Column(Float)
    risk_level = Column(String(50))
    expected_time = Column(DateTime)
    confidence = Column(Float)
    created_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime)
    geom = Column(Geometry('POINT', srid=4326))
```

## Sample routers/alerts.py
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertCreate, AlertResponse
from typing import List

router = APIRouter()

@router.get("/active", response_model=List[AlertResponse])
def get_active_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.expires_at > func.now()).all()
    return alerts

@router.get("/location", response_model=List[AlertResponse])
def get_alerts_by_location(lat: float, lng: float, db: Session = Depends(get_db)):
    # PostGIS spatial query
    # ST_DWithin for distance-based filtering
    pass

@router.post("/subscribe")
def subscribe_to_alerts(subscription: SubscriptionCreate, db: Session = Depends(get_db)):
    # Store subscription in database
    pass
```

## Sample requirements.txt
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
geoalchemy2==0.14.2
alembic==1.12.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
slowapi==0.1.9
redis==5.0.1
websockets==12.0
```

## Docker Compose for PostgreSQL
```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:14-3.3
    environment:
      POSTGRES_USER: floodwatch
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: floodwatch
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Running the Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
