@echo off
REM EcoCode Full Stack Startup Script for Windows
REM This script starts both the FastAPI backend and React frontend

echo ======================================
echo Starting EcoCode - Flood Forecaster
echo ======================================

REM Check if .env exists
if not exist ".env" (
    echo Warning: .env file not found. Creating from .env.example...
    copy .env.example .env
    echo Please update .env with your actual API keys before running again
    pause
    exit /b 1
)

REM Start Backend in a new window
echo.
echo Starting Backend (FastAPI) on http://localhost:8000
start "EcoCode Backend" cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend to initialize
echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

REM Start Frontend in a new window
echo.
echo Starting Frontend (React) on http://localhost:3000
start "EcoCode Frontend" cmd /k "npm start"

REM Display information
echo.
echo ======================================
echo EcoCode is now running!
echo ======================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ReDoc: http://localhost:8000/redoc
echo.
echo Two new windows have been opened:
echo - Backend (FastAPI)
echo - Frontend (React)
echo.
echo Close those windows to stop the services
echo ======================================
pause
