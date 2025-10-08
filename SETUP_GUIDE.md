# 🚀 Complete Setup Guide for FloodAura

This guide will help you set up and run the complete FloodAura project with both frontend and backend.

## ✅ Current Status

- ✅ Repository merged (main + add-backend-2025-10-08 branches)
- ✅ Frontend dependencies installed
- ✅ .gitignore files created
- ✅ .env file created
- ⚠️ Python needs to be installed for backend
- ⚠️ Backend dependencies need to be installed
- ⚠️ Database credentials need to be configured

## 📋 Prerequisites Checklist

### For Frontend (React)
- ✅ Node.js 16+ and npm (Already installed)

### For Backend (FastAPI)
- ❌ Python 3.9+ (Need to install)
- ❌ pip (Python package manager - comes with Python)

### For Database
- NeonDB account (free tier) - Sign up at https://neon.tech
- OpenWeatherMap API key - Get free key at https://openweathermap.org/api

## 🔧 Installation Steps

### Step 1: Install Python (Required for Backend)

1. Go to https://www.python.org/downloads/
2. Download Python 3.9 or higher for Windows
3. During installation, **check "Add Python to PATH"**
4. Verify installation:
   ```powershell
   python --version
   ```

### Step 2: Install Backend Dependencies

After installing Python, run:

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 3: Configure Environment Variables

1. **Get NeonDB Connection String:**
   - Go to https://console.neon.tech
   - Create a free account and new project
   - Copy your connection string (looks like: `postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require`)

2. **Get OpenWeatherMap API Key:**
   - Go to https://openweathermap.org/api
   - Sign up for free account
   - Get your API key from dashboard

3. **Update .env file:**
   - Open `.env` file in the project root
   - Replace these values:
     ```env
     DATABASE_URL=your_actual_neondb_connection_string
     OPENWEATHERMAP_API_KEY=your_actual_api_key
     SECRET_KEY=generate_new_secret_key_here
     ```

4. **Generate Secret Key:**
   ```powershell
   # In PowerShell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
   ```
   Copy the output and use it as your SECRET_KEY

### Step 4: Run the Project

#### Option A: Run Frontend Only (Current State)

```powershell
npm start
```

The React app will open at http://localhost:3000

#### Option B: Run Full Stack (After Python Setup)

**Terminal 1 - Backend:**
```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run FastAPI server
python main.py
```

Backend will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Terminal 2 - Frontend:**
```powershell
npm start
```

Frontend will be available at:
- App: http://localhost:3000

## 📁 Project Structure

```
ecocode1/
├── public/                    # Static files
├── src/                       # React source code
│   ├── components/           # Reusable components
│   ├── pages/               # Page components
│   ├── App.js               # Main app
│   └── index.js             # Entry point
├── app/                      # Backend FastAPI application
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   ├── utils/               # Utilities
│   ├── config.py            # Configuration
│   ├── database.py          # Database setup
│   ├── models.py            # Database models
│   └── schemas.py           # API schemas
├── main.py                   # FastAPI entry point
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
├── .env                      # Environment variables (DO NOT COMMIT)
├── .env.example             # Example env file
└── .gitignore               # Git ignore rules
```

## 🔍 Testing the API

Once the backend is running, you can test it:

### Using the Browser
Visit http://localhost:8000/docs for interactive API documentation

### Using PowerShell
```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get

# Calculate flood risk
$body = @{
    latitude = 40.7128
    longitude = -74.0060
    location_name = "Test Location"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/floods/calculate-risk" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

## 🐛 Troubleshooting

### Frontend Issues

**Error: "npm command not found"**
- Install Node.js from https://nodejs.org/

**Port 3000 already in use**
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Backend Issues

**Error: "python not found"**
- Install Python and ensure "Add to PATH" was checked during installation

**Error: "Cannot activate virtual environment"**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Database connection error**
- Verify DATABASE_URL in .env is correct
- Check your internet connection (NeonDB is cloud-based)
- Ensure NeonDB project is active in console

**Import errors**
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

### Port 8000 already in use
```powershell
# Kill process on port 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

## 📚 Available Scripts

### Frontend
- `npm start` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Backend
- `python main.py` - Start FastAPI server
- `uvicorn main:app --reload` - Start with auto-reload
- `pytest tests/` - Run tests (after installing pytest)

## 🎯 Quick Start Commands

### First Time Setup
```powershell
# Install Python first from https://python.org

# Install frontend dependencies (already done)
npm install

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Update .env with your credentials
# Then run both servers (in separate terminals)
```

### Daily Development
```powershell
# Terminal 1 - Backend
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 2 - Frontend
npm start
```

## 🌐 URLs Summary

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React application |
| Backend API | http://localhost:8000 | FastAPI server |
| API Docs | http://localhost:8000/docs | Interactive API docs |
| ReDoc | http://localhost:8000/redoc | Alternative API docs |

## 📝 Next Steps

1. ✅ Install Python 3.9+
2. ✅ Setup virtual environment
3. ✅ Install backend dependencies
4. ✅ Get NeonDB connection string
5. ✅ Get OpenWeatherMap API key
6. ✅ Update .env file
7. ✅ Run backend server
8. ✅ Run frontend server
9. ✅ Test the application

## 🔐 Security Notes

- Never commit `.env` file to git (already in .gitignore)
- Keep your API keys and database credentials secret
- Generate a strong SECRET_KEY for production
- Use different credentials for development and production

## 📧 Support

- Check the README.md for detailed documentation
- Review API_EXAMPLES.md for API usage examples
- Check BACKEND_INTEGRATION.md for integration guide

---

**Happy Coding! 🎉**
