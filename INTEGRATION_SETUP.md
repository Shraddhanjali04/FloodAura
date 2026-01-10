# 🚀 EcoCode - Complete Integration Guide

## 🎯 Quick Start (Make Your Project Live)

This guide will help you connect the backend with the frontend and run your complete full-stack application.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Python 3.9+** installed
- ✅ **Node.js 16+** and npm installed
- ✅ **PostgreSQL** database (NeonDB recommended)
- ✅ API Keys:
  - OpenWeatherMap API key
  - Google Maps API key (for frontend)
  - Google Elevation API key (optional)
  - Gemini API key (for AI chatbot)

---

## 🔧 Step 1: Environment Configuration

### Backend Configuration (.env)

The `.env` file has already been created. Update it with your actual credentials:

```bash
# Edit the .env file
nano .env  # or use any text editor
```

**Required fields to update:**
```env
DATABASE_URL=your_neondb_connection_string
OPENWEATHERMAP_API_KEY=your_openweather_key
GEMINI_API_KEY=your_gemini_key
```

### Frontend Configuration (.env.local)

Update the `.env.local` file with your frontend API keys:

```bash
nano .env.local
```

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_GEMINI_API_KEY=your_gemini_key
```

---

## 📦 Step 2: Install Dependencies

### Install Backend Dependencies

```bash
# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
```

### Install Frontend Dependencies

```bash
# Install Node packages
npm install
```

---

## 🗄️ Step 3: Database Setup

### Initialize Database Tables

```bash
# Run the setup script
python setup_alembic.py
```

Or manually:

```bash
# If alembic is configured
alembic upgrade head
```

---

## 🚀 Step 4: Start the Application

### Option 1: Automated Startup (Recommended)

**On macOS/Linux:**
```bash
./start.sh
```

**On Windows:**
```cmd
start.bat
```

This will automatically start both backend and frontend!

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm start
```

---

## 🌐 Access Your Application

Once both services are running:

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Frontend** | http://localhost:3000 | Main React application |
| 🔧 **Backend API** | http://localhost:8000 | FastAPI REST API |
| 📚 **API Documentation** | http://localhost:8000/docs | Interactive Swagger UI |
| 📖 **API ReDoc** | http://localhost:8000/redoc | Alternative API docs |
| 🧪 **Test Connection** | http://localhost:8000/api/test-connection | Backend health check |

---

## ✅ Step 5: Test the Integration

### Test Backend Connection

Open your browser and visit:
```
http://localhost:8000/api/test-connection
```

You should see:
```json
{
  "status": "success",
  "message": "Backend connected successfully!",
  "timestamp": "2026-01-10T00:00:00Z",
  "cors_enabled": true,
  "api_version": "1.0.0"
}
```

### Test Frontend-Backend Integration

1. Open http://localhost:3000
2. Navigate to the **Live Map** page
3. Click on any location on the map
4. Check if flood data loads successfully

---

## 🔄 How the Integration Works

### CORS Middleware Configuration

The backend is configured with CORS middleware to allow frontend requests:

```python
# In main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Proxy Configuration

The frontend package.json includes a proxy setting:

```json
"proxy": "http://localhost:8000"
```

This allows the React app to make API calls without CORS issues during development.

### API Service

The frontend uses a centralized API service (`src/services/api.js`) that:
- Handles all API calls
- Manages error handling
- Sets proper headers
- Uses environment variables for API URL

---

## 🐛 Troubleshooting

### Backend Won't Start

**Issue:** Database connection error

**Solution:**
```bash
# Check DATABASE_URL in .env
# Ensure NeonDB is accessible
# Test connection:
python setup_check.py
```

### Frontend Can't Connect to Backend

**Issue:** CORS errors in browser console

**Solution:**
1. Verify backend is running on port 8000
2. Check ALLOWED_ORIGINS in .env includes `http://localhost:3000`
3. Restart both services

### Port Already in Use

**Issue:** Port 8000 or 3000 is busy

**Solution:**
```bash
# Find and kill process on port 8000 (macOS/Linux)
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Missing API Keys

**Issue:** API features not working

**Solution:**
- Get OpenWeatherMap API key: https://openweathermap.org/api
- Get Google Maps API key: https://console.cloud.google.com/
- Get Gemini API key: https://makersuite.google.com/app/apikey
- Update both `.env` and `.env.local` files

---

## 📊 Monitoring Logs

### View Backend Logs (when using start.sh)

```bash
tail -f backend.log
```

### View Frontend Logs

```bash
tail -f frontend.log
```

---

## 🛑 Stopping the Application

### If using start.sh/start.bat:
Press `Ctrl+C` in the terminal

### If running manually:
Press `Ctrl+C` in both terminal windows

---

## 🚀 Production Deployment

For production deployment, see:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) - Backend integration details

### Quick Production Checklist:

- [ ] Set `DEBUG=False` in .env
- [ ] Use production database
- [ ] Configure proper ALLOWED_ORIGINS
- [ ] Set up HTTPS
- [ ] Use environment variables for secrets
- [ ] Build frontend: `npm run build`
- [ ] Use production WSGI server (Gunicorn/Uvicorn)

---

## 📝 Key Features Now Available

With the backend-frontend integration complete, you can now use:

✅ **Real-time Flood Prediction** - Calculate flood risk for any location
✅ **Interactive Map** - View flood events on Google Maps
✅ **AI Chatbot** - Ask questions about flood safety
✅ **Route Verdict** - Check if a route is safe from floods
✅ **Alert System** - Get notified about flood risks
✅ **User Authentication** - Register and login functionality
✅ **Historical Data** - View past flood events

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide
2. Review API documentation at http://localhost:8000/docs
3. Check logs in `backend.log` and `frontend.log`
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed

---

## 🎉 Success!

Your EcoCode application is now fully integrated and live!

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

Enjoy using your hyperlocal urban flood forecaster! 🌊
