#!/bin/bash

# EcoCode Deployment Helper Script
# Helps prepare and deploy your application to production

set -e  # Exit on error

echo "🚀 EcoCode Deployment Helper"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "main.py" ]; then
    echo -e "${RED}❌ Error: Must run from project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}What would you like to do?${NC}"
echo ""
echo "1) Check deployment readiness"
echo "2) Build frontend for production"
echo "3) Test production build locally"
echo "4) Prepare for GitHub push"
echo "5) Show deployment URLs (after deployment)"
echo "6) Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Running deployment readiness check...${NC}"
        python3 deployment_check.py
        ;;
    
    2)
        echo ""
        echo -e "${BLUE}Building frontend for production...${NC}"
        npm run build
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Production build completed successfully!${NC}"
            echo "Build output is in: ./build/"
            echo ""
            echo "Build size:"
            du -sh build/
        else
            echo -e "${RED}❌ Build failed!${NC}"
            exit 1
        fi
        ;;
    
    3)
        echo ""
        echo -e "${BLUE}Testing production build locally...${NC}"
        
        # Check if serve is installed
        if ! command -v npx &> /dev/null; then
            echo -e "${RED}❌ npx not found${NC}"
            exit 1
        fi
        
        echo "Building production version..."
        npm run build
        
        echo ""
        echo -e "${GREEN}✅ Starting local server...${NC}"
        echo "Server will run on: http://localhost:5000"
        echo "Press Ctrl+C to stop"
        echo ""
        npx serve -s build -l 5000
        ;;
    
    4)
        echo ""
        echo -e "${BLUE}Preparing for GitHub push...${NC}"
        
        # Check git status
        if [ ! -d ".git" ]; then
            echo -e "${YELLOW}⚠️  Git not initialized. Initializing...${NC}"
            git init
            echo -e "${GREEN}✅ Git initialized${NC}"
        fi
        
        # Check if remote exists
        if git remote get-url origin &> /dev/null; then
            echo -e "${GREEN}✅ GitHub remote configured${NC}"
            git remote -v
        else
            echo ""
            echo -e "${YELLOW}⚠️  No GitHub remote configured${NC}"
            echo ""
            read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " repo_url
            
            if [ -n "$repo_url" ]; then
                git remote add origin "$repo_url"
                echo -e "${GREEN}✅ Remote added${NC}"
            fi
        fi
        
        # Show status
        echo ""
        echo "Current git status:"
        git status
        
        echo ""
        echo -e "${BLUE}Ready to commit and push?${NC}"
        read -p "Enter commit message (or press Enter to skip): " commit_msg
        
        if [ -n "$commit_msg" ]; then
            git add .
            git commit -m "$commit_msg"
            echo ""
            echo -e "${GREEN}✅ Changes committed${NC}"
            echo ""
            read -p "Push to GitHub now? (y/n): " push_confirm
            
            if [ "$push_confirm" = "y" ]; then
                git push -u origin main || git push -u origin master
                echo ""
                echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
                echo ""
                echo "Next steps:"
                echo "1. Deploy backend to Render: https://dashboard.render.com"
                echo "2. Deploy frontend to Netlify: https://app.netlify.com"
                echo ""
                echo "See QUICK_DEPLOY.md for detailed instructions"
            fi
        fi
        ;;
    
    5)
        echo ""
        echo -e "${BLUE}📍 Your Deployment URLs${NC}"
        echo "================================"
        echo ""
        echo -e "${GREEN}Frontend (Netlify):${NC}"
        echo "🌐 https://your-app-name.netlify.app"
        echo ""
        echo -e "${GREEN}Backend (Render):${NC}"
        echo "🔧 https://ecocode-backend-xxxx.onrender.com"
        echo "📚 https://ecocode-backend-xxxx.onrender.com/docs"
        echo ""
        echo -e "${YELLOW}Note: Replace with your actual URLs after deployment${NC}"
        echo ""
        echo "To check if backend is running:"
        echo "curl https://your-backend-url.onrender.com/health"
        ;;
    
    6)
        echo "Goodbye! 👋"
        exit 0
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Done!${NC}"
