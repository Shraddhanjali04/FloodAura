#!/bin/bash

# EcoCode Full Stack Startup Script
# This script starts both the FastAPI backend and React frontend

echo "🌊 Starting EcoCode - Hyperlocal Urban Flood Forecaster"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env with your actual API keys before running again${NC}"
    exit 1
fi

# Change to project directory
cd "$(dirname "$0")"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Backend (FastAPI)
echo -e "\n${BLUE}🚀 Starting Backend (FastAPI) on http://localhost:8000${NC}"
python3 main.py > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${YELLOW}⚠️  Backend failed to start. Check backend.log for details${NC}"
    tail -20 backend.log
    exit 1
fi

echo -e "${GREEN}✅ Backend started successfully (PID: $BACKEND_PID)${NC}"

# Start Frontend (React)
echo -e "\n${BLUE}🎨 Starting Frontend (React) on http://localhost:3000${NC}"
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend started successfully (PID: $FRONTEND_PID)${NC}"

# Display access information
echo -e "\n${GREEN}=================================================="
echo "🎉 EcoCode is now running!"
echo "=================================================="
echo -e "📱 Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "🔧 Backend API: ${BLUE}http://localhost:8000${NC}"
echo -e "📚 API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo -e "📖 ReDoc: ${BLUE}http://localhost:8000/redoc${NC}"
echo ""
echo -e "📋 Logs:"
echo -e "   Backend: tail -f backend.log"
echo -e "   Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo "=================================================="

# Keep script running and show logs
tail -f backend.log frontend.log &
wait $BACKEND_PID $FRONTEND_PID
