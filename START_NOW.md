# 🎯 Quick Start - Get Your Project Live NOW!

## ⚡ Fastest Way to Start

### Step 1: Get API Key (2 minutes)
1. Go to https://openweathermap.org/api
2. Click "Sign Up" (free account)
3. Get your API key from the dashboard
4. Copy it

### Step 2: Update Configuration
Open the `.env` file and update:
```env
OPENWEATHERMAP_API_KEY=paste_your_key_here
```

### Step 3: Start the Application
```bash
./start.sh
```

That's it! Your application will be live at:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000/docs

---

## 🚀 Starting Right Now (Without Full Setup)

If you want to start immediately and configure API keys later:

```bash
# Start backend only
python3 -m uvicorn main:app --reload &

# Start frontend
npm start
```

The app will work with fallback/mock data until you add the API keys.

---

## ✅ What's Already Done

✅ Backend configured with CORS middleware
✅ Frontend proxy setup complete  
✅ Database connection configured
✅ All dependencies installed
✅ Test endpoint created
✅ Startup scripts ready

---

## 🔗 Integration Features Active

### CORS Configuration
```python
# Backend automatically allows requests from:
- http://localhost:3000 (React dev server)
- http://localhost:5173 (Vite alternative)
```

### API Base URL
```javascript
// Frontend automatically connects to:
const API_BASE_URL = 'http://localhost:8000/api/v1'
```

### Middleware Stack
- ✅ CORS enabled
- ✅ JSON response formatting
- ✅ Error handling middleware
- ✅ Database session management

---

## 🧪 Test the Connection

Once both services are running:

1. **Backend Health Check:**
   ```
   curl http://localhost:8000/api/test-connection
   ```

2. **Frontend to Backend:**
   - Open http://localhost:3000
   - Open browser DevTools (F12)
   - Check Network tab for API calls

---

## 📊 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/floods/` | GET | Get all flood events |
| `/api/v1/floods/calculate-risk` | POST | Calculate flood risk |
| `/api/v1/floods/nearby/` | GET | Get nearby floods |
| `/api/v1/auth/register` | POST | Register new user |
| `/api/v1/auth/login` | POST | User login |
| `/api/map/data` | GET | Get map data |
| `/api/alerts/` | GET | Get alerts |
| `/api/route-verdict` | POST | Check route safety |
| `/api/chat` | POST | AI chatbot |

---

## 🛠️ Troubleshooting Quick Fixes

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
- Ensure backend is running on port 8000
- Check browser console for error details
- Verify ALLOWED_ORIGINS in .env includes localhost:3000

### Can't Connect
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check if frontend can reach backend
curl http://localhost:8000/api/test-connection
```

---

## 🎉 You're All Set!

The backend and frontend are now fully integrated with:
- ✅ Proper CORS configuration
- ✅ Proxy setup for development
- ✅ Centralized API service
- ✅ Error handling
- ✅ Environment configuration

**Just start the servers and you're live!** 🚀
