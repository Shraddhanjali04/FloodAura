# 🚀 Complete Full-Stack Setup & Run Guide

## FloodWatch - Backend + Frontend Integration

---

## 📋 Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.9+ installed (`python3 --version`)
- ✅ Node.js 14+ installed (`node --version`)
- ✅ npm installed (`npm --version`)

---

## 🔧 Step-by-Step Setup

### **STEP 1: Create Environment File**

The project already has database and API credentials configured. Let's create the `.env` file:

```bash
cd /Users/arnabmaity/Desktop/ecocode

# Copy the example file
cp .env.example .env

# The .env file now contains:
# - NeonDB PostgreSQL database (already configured)
# - OpenWeatherMap API key (already configured)
# - Frontend API URL (http://localhost:8000)
```

**✅ Database & API Keys Already Configured!**
- Database: NeonDB PostgreSQL (serverless)
- Weather API: OpenWeatherMap API key ready
- No additional setup needed!

---

### **STEP 2: Backend Setup (FastAPI + PostgreSQL)**

#### 2a. Create Python Virtual Environment
```bash
cd /Users/arnabmaity/Desktop/ecocode

# Create virtual environment
python3 -m venv venv

# Activate it (macOS/Linux)
source venv/bin/activate

# You should see (venv) in your terminal prompt
```

#### 2b. Install Python Dependencies
```bash
# Make sure venv is activated
pip install --upgrade pip
pip install -r requirements.txt

# This installs:
# - FastAPI (web framework)
# - SQLAlchemy (database ORM)
# - psycopg2 (PostgreSQL driver)
# - httpx/requests (API calls)
# - python-jose (JWT auth)
# - All other dependencies
```

#### 2c. Initialize Database
```bash
# Run database initialization
python setup_check.py

# This will:
# ✅ Check database connection
# ✅ Create tables if they don't exist
# ✅ Verify all dependencies
```

#### 2d. Start Backend Server
```bash
# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Server will start at:
# 🌐 http://localhost:8000
# 📚 API Docs: http://localhost:8000/docs
# 📖 ReDoc: http://localhost:8000/redoc
```

**Keep this terminal running!**

---

### **STEP 3: Frontend Setup (React)**

#### 3a. Open New Terminal
```bash
# Open a NEW terminal window/tab
# Don't close the backend terminal!

cd /Users/arnabmaity/Desktop/ecocode
```

#### 3b. Install Frontend Dependencies (if needed)
```bash
# If node_modules doesn't exist
npm install

# This installs:
# - React 18
# - React Router
# - Tailwind CSS
# - Lucide React (icons)
```

#### 3c. Start Frontend Development Server
```bash
# Start React app
npm start

# Server will start at:
# 🌐 http://localhost:3000

# Browser will open automatically
```

---

## 🎯 How It Works - Data Flow

### **Weather Data Fetching Flow:**

```
1. User opens Live Map page (http://localhost:3000/live-map)
   ↓
2. Frontend calls: GET http://localhost:8000/api/v1/floods
   ↓
3. Backend receives request
   ↓
4. Backend calls OpenWeatherMap API with configured key
   ↓
5. Backend processes weather data + calculates flood risk
   ↓
6. Backend stores data in NeonDB PostgreSQL database
   ↓
7. Backend returns JSON response to frontend
   ↓
8. Frontend displays:
   - Active alerts
   - Flood risk levels
   - Weather conditions
   - Map markers
```

---

## 🔌 API Endpoints Available

### **Base URL:** `http://localhost:8000/api/v1`

#### **Floods API**
```bash
# Get all flood events
GET /floods

# Calculate flood risk for location
POST /floods/calculate-risk
Body: {
  "latitude": 40.7128,
  "longitude": -74.0060
}

# Get nearby flood events
GET /floods/nearby?lat=40.7128&lng=-74.0060&radius=5
```

#### **Alerts API**
```bash
# Get active alerts
GET /alerts/active

# Get alerts by location
GET /alerts/location?lat=40.7128&lng=-74.0060

# Subscribe to alerts
POST /alerts/subscribe
Body: {
  "email": "user@example.com",
  "phone": "+1234567890",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### **Map API**
```bash
# Search location
GET /map/search?location=New York

# Get risk data
POST /map/risk-data
Body: {
  "bounds": {
    "north": 40.8,
    "south": 40.7,
    "east": -73.9,
    "west": -74.1
  }
}

# Locate user
POST /map/locate
Body: {
  "lat": 40.7128,
  "lng": -74.0060
}
```

---

## 🧪 Testing the Integration

### **Test 1: Check Backend Health**
```bash
# In browser or terminal:
curl http://localhost:8000/

# Expected response:
{
  "message": "Hyperlocal Urban Flood Forecaster API",
  "version": "1.0.0",
  "status": "operational",
  "docs": "/docs"
}
```

### **Test 2: Check API Documentation**
Open in browser:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Here you can test all API endpoints directly!

### **Test 3: Test Weather API Integration**
```bash
# Calculate flood risk (replace with your coordinates)
curl -X POST http://localhost:8000/api/v1/floods/calculate-risk \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060
  }'

# Expected: Weather data + flood risk calculation
```

### **Test 4: Check Frontend Connection**
1. Open http://localhost:3000/live-map
2. Open browser console (F12)
3. Click "Locate Me" button
4. Check console for API calls
5. Check Network tab for requests to localhost:8000

---

## 📊 Real-Time Data Display

### **Where to See Backend Data in Frontend:**

#### **1. Live Map Page** (`http://localhost:3000/live-map`)
- **Active Alerts Sidebar**: Shows flood alerts from backend
- **Map Markers**: Displays flood events from database
- **Last Updated**: Shows real-time data refresh timestamp

#### **2. Alerts Page** (`http://localhost:3000/alerts`)
- **Active Alerts**: Fetched from `/api/v1/alerts/active`
- **Alert History**: Shows historical flood events
- **Subscription Form**: Sends data to backend

#### **3. Home Page** (`http://localhost:3000`)
- **Statistics**: Live data from backend
  - Total alerts count
  - Areas monitored
  - Prediction accuracy

---

## 🔍 Verifying Data Flow

### **Check Backend Logs:**
In the backend terminal, you should see:
```
INFO:     127.0.0.1:xxxx - "GET /api/v1/floods HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxx - "GET /api/v1/alerts/active HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxx - "POST /api/v1/floods/calculate-risk HTTP/1.1" 200 OK
```

### **Check Frontend Console:**
Open browser DevTools (F12) → Console tab:
```javascript
// You should see:
✅ API connected: http://localhost:8000
✅ Fetching active alerts...
✅ Received 3 alerts
✅ Weather data loaded
```

### **Check Network Tab:**
Open browser DevTools (F12) → Network tab:
- Filter by "XHR" or "Fetch"
- Look for requests to `localhost:8000`
- Check response data (should show weather info)

---

## ⚙️ Configuration Files

### **Frontend Config** (`.env`)
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_WS_URL=ws://localhost:8000/ws
```

### **Backend Config** (`.env`)
```env
# Database (Already configured!)
DATABASE_URL=postgresql://neondb_owner:...@ep-...neon.tech/neondb

# Weather API (Already configured!)
OPENWEATHERMAP_API_KEY=0d155cf64ebcf8ba3a1efca8f23732e1

# CORS (Frontend URL)
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🐛 Troubleshooting

### **Problem 1: Backend won't start**
```bash
# Error: "No module named 'fastapi'"
Solution: Make sure venv is activated
source venv/bin/activate
pip install -r requirements.txt

# Error: "Database connection failed"
Solution: Check .env file has correct DATABASE_URL
```

### **Problem 2: Frontend can't connect to backend**
```bash
# Error: "Network Error" in console
Solution: 
1. Check backend is running (http://localhost:8000)
2. Check REACT_APP_API_URL in .env
3. Restart frontend: npm start
```

### **Problem 3: CORS errors**
```bash
# Error: "CORS policy: No 'Access-Control-Allow-Origin'"
Solution:
1. Check ALLOWED_ORIGINS in backend .env
2. Should include: http://localhost:3000
3. Restart backend server
```

### **Problem 4: Weather API not working**
```bash
# Error: "OpenWeatherMap API error"
Solution:
1. Check OPENWEATHERMAP_API_KEY in .env
2. Verify API key is valid at https://openweathermap.org/api
3. Free tier has rate limits (60 calls/minute)
```

---

## 📱 Accessing Your App

### **Frontend URLs:**
- 🏠 Home: http://localhost:3000
- 🗺️ Live Map: http://localhost:3000/live-map
- 🚨 Alerts: http://localhost:3000/alerts
- ℹ️ About: http://localhost:3000/about

### **Backend URLs:**
- 🔌 API Root: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs
- 📖 ReDoc: http://localhost:8000/redoc

---

## 🎬 Quick Command Summary

### **Terminal 1 (Backend):**
```bash
cd /Users/arnabmaity/Desktop/ecocode
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **Terminal 2 (Frontend):**
```bash
cd /Users/arnabmaity/Desktop/ecocode
npm start
```

---

## ✅ Success Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:3000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Database connected (NeonDB)
- [ ] Weather API working (OpenWeatherMap)
- [ ] CORS configured correctly
- [ ] Frontend can fetch data from backend
- [ ] Alerts page shows data
- [ ] Live Map displays markers
- [ ] Browser console shows no CORS errors

---

## 🎉 You're All Set!

Your full-stack flood forecasting application is now running with:
- ✅ Real-time weather data from OpenWeatherMap
- ✅ PostgreSQL database (NeonDB) storing flood events
- ✅ FastAPI backend processing requests
- ✅ React frontend displaying data
- ✅ Complete data flow from API → Backend → Database → Frontend

**Enjoy your hyperlocal flood forecaster!** 🌊🗺️

---

**Last Updated**: October 9, 2025
**Project**: FloodWatch
**Stack**: React + FastAPI + PostgreSQL + OpenWeatherMap API
