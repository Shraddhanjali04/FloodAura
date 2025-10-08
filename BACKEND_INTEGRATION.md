# FloodWatch Backend Integration

## Tech Stack

### Backend
- **FastAPI** (Python 3.9+) - High-performance async web framework
- **PostgreSQL** (v14+) - Relational database for alerts, users, and predictions
- **PostGIS** - PostgreSQL extension for geospatial queries
- **SQLAlchemy** - ORM for database operations
- **Alembic** - Database migrations

### Middleware & Services
- **CORS Middleware** - Cross-origin resource sharing for React frontend
- **Uvicorn** - ASGI server for FastAPI
- **WebSockets** - Real-time alert push notifications
- **Redis** (optional) - Caching layer for map tiles and predictions
- **Apache Kafka** - Event streaming for data pipeline (production)

### Frontend ↔ Backend Communication
- **REST API** - HTTP/HTTPS endpoints for CRUD operations
- **WebSocket** - Real-time bidirectional communication
- **Axios/Fetch** - HTTP client for API calls

---

## Backend API Structure

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### 1. Alerts API (`/alerts`)
```
GET    /alerts/active              - Get all active alerts
GET    /alerts/location            - Get alerts by lat/lng
POST   /alerts/subscribe           - Subscribe to alerts (email/phone)
GET    /alerts/history             - Get alert history
```

#### 2. Map API (`/map`)
```
GET    /map/search                 - Search location by name
POST   /map/risk-data              - Get flood risk for map bounds
POST   /map/locate                 - Get data for user coordinates
GET    /map/last-update            - Get last data refresh timestamp
```

#### 3. Analytics API (`/analytics`)
```
GET    /analytics/accuracy         - Prediction accuracy stats
GET    /analytics/coverage         - Coverage statistics
GET    /analytics/trends           - Historical trends data
```

#### 4. WebSocket (`/ws`)
```
WS     /ws                         - Real-time alert stream
```

---

## Database Schema (PostgreSQL)

### Tables

**1. alerts**
```sql
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    risk_level VARCHAR(50),
    expected_time TIMESTAMP,
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- PostGIS geometry column
ALTER TABLE alerts ADD COLUMN geom GEOMETRY(Point, 4326);
```

**2. subscriptions**
```sql
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    phone VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notification_preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**3. predictions**
```sql
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    risk_score FLOAT,
    water_depth FLOAT,
    confidence FLOAT,
    predicted_for TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**4. locations**
```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geom GEOMETRY(Point, 4326),
    metadata JSONB
);
```

---

## Middleware Configuration

### 1. CORS Middleware (FastAPI)
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Rate Limiting (optional)
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

### 3. Authentication Middleware (JWT)
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Verify JWT token
    pass
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
npm install axios
# or use built-in fetch (already implemented)
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws
```

### 3. Import API Utils
```javascript
import { alertsAPI, mapAPI } from './utils/api';

// Usage
const alerts = await alertsAPI.getActive();
const location = await mapAPI.searchLocation('Downtown');
```

---

## Data Flow

### Alert Creation Flow
```
1. Data Collection (Sensors/APIs)
   ↓
2. ML Model Processing
   ↓
3. PostgreSQL Insert (via SQLAlchemy)
   ↓
4. WebSocket Broadcast
   ↓
5. React Frontend Update
```

### Map Risk Query Flow
```
1. User pans map
   ↓
2. React sends map bounds
   ↓
3. FastAPI receives POST /map/risk-data
   ↓
4. PostGIS spatial query
   ↓
5. Return GeoJSON features
   ↓
6. Render on map layer
```

---

## Running the Full Stack

### Backend (FastAPI + PostgreSQL)
```bash
# Start PostgreSQL
docker-compose up -d postgres

# Run FastAPI
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

---

## Middleware Summary

| Middleware | Purpose | Implementation |
|------------|---------|----------------|
| **CORS** | Allow React frontend to call API | FastAPI CORSMiddleware |
| **WebSocket** | Real-time alert push | FastAPI WebSocketRoute |
| **SQLAlchemy** | ORM for database operations | Python ORM library |
| **Alembic** | Database migrations | Migration tool |
| **PostGIS** | Geospatial queries | PostgreSQL extension |
| **Uvicorn** | ASGI server | FastAPI default server |
| **Rate Limiter** | API abuse prevention | SlowAPI or custom |
| **JWT Auth** | User authentication | python-jose |
| **Axios/Fetch** | HTTP client (frontend) | Built-in fetch API |
| **Redis** | Caching layer (optional) | Redis + aioredis |
| **Kafka** | Event streaming (production) | Apache Kafka |

---

## Next Steps

1. Set up PostgreSQL with PostGIS extension
2. Create FastAPI project structure
3. Implement database models with SQLAlchemy
4. Create API endpoints matching the schema above
5. Integrate Mapbox GL JS or Leaflet in React
6. Connect WebSocket for real-time updates
7. Deploy backend (AWS/GCP/Azure)
8. Deploy frontend (Vercel/Netlify)
