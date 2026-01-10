# 🚀 Deployment Guide - EcoCode to Production

## Architecture

Your application uses a **decoupled architecture**:
- **Frontend (React)** → Netlify
- **Backend (Python/FastAPI)** → Render.com (or Railway/Vercel)
- **Database** → NeonDB (already configured)

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account
- ✅ Netlify account (free at https://netlify.com)
- ✅ Render account (free at https://render.com)
- ✅ Your code pushed to GitHub
- ✅ API keys ready (OpenWeatherMap, Google Maps, Gemini)

---

## 🔧 Step 1: Deploy Backend to Render

### Option A: Using Render Dashboard (Easiest)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Select your GitHub repository
   - Branch: `main`

3. **Configure Service**
   ```
   Name: ecocode-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: (leave blank or specify if backend is in subfolder)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Plan: Free
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_6fH7gSdRxTpX@ep-nameless-mud-adtrjmjk-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   OPENWEATHERMAP_API_KEY = 68e1583c818816fac3a7f297540898ad
   GEMINI_API_KEY = AIzaSyAL3ouFdIzxhTnXXgeGFvpCL65OpkI0Q8A
   SECRET_KEY = 627e87d4391226adb0646d4f0c9b760e205c0dec8f05de73a1ef0804dac53631
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   APP_NAME = Hyperlocal Urban Flood Forecaster
   DEBUG = False
   ALLOWED_ORIGINS = https://your-app.netlify.app,http://localhost:3000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL: `https://ecocode-backend.onrender.com`

### Option B: Using render.yaml (Automated)

The `render.yaml` file is already created. Just:
1. Push your code to GitHub
2. In Render dashboard, click "New" → "Blueprint"
3. Connect your repository
4. Render will auto-detect `render.yaml` and deploy

---

## 🎨 Step 2: Deploy Frontend to Netlify

### Method 1: Using Netlify UI (Recommended)

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"

2. **Connect to GitHub**
   - Select your repository
   - Branch: `main`

3. **Configure Build Settings**
   ```
   Base directory: (leave blank)
   Build command: npm run build
   Publish directory: build
   ```

4. **Add Environment Variables**
   Go to "Site settings" → "Environment variables" → "Add a variable":
   ```
   REACT_APP_API_URL = https://ecocode-backend.onrender.com/api
   REACT_APP_GOOGLE_MAPS_API_KEY = your_google_maps_api_key
   REACT_APP_GEMINI_API_KEY = AIzaSyAL3ouFdIzxhTnXXgeGFvpCL65OpkI0Q8A
   ```
   
   ⚠️ **IMPORTANT**: Update `REACT_APP_API_URL` with your actual Render backend URL from Step 1!

5. **Deploy**
   - Click "Deploy site"
   - Wait 3-5 minutes
   - Your site will be live at: `https://your-app-name.netlify.app`

6. **Update Backend CORS**
   - Go back to Render dashboard
   - Update `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS = https://your-app-name.netlify.app,http://localhost:3000
   ```
   - This allows your frontend to communicate with backend

### Method 2: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Follow the prompts:
# - Build command: npm run build
# - Publish directory: build
```

---

## 🔗 Step 3: Update CORS and API URLs

### Update Backend CORS (in Render)
After deploying frontend, update backend environment variable:
```
ALLOWED_ORIGINS = https://your-app-name.netlify.app,http://localhost:3000
```

### Update Frontend API URL (in Netlify)
Update environment variable:
```
REACT_APP_API_URL = https://ecocode-backend.onrender.com/api
```

---

## ✅ Step 4: Verify Deployment

### Test Backend
```bash
curl https://ecocode-backend.onrender.com/health
```

Expected response:
```json
{"status":"healthy","service":"flood-forecaster-api","database":"connected"}
```

### Test Frontend
1. Visit `https://your-app-name.netlify.app`
2. Check browser console for errors
3. Verify API calls are working

---

## 🎯 Alternative Backend Hosting Options

### Railway.app (Alternative to Render)
1. Visit https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Select repository
4. Add environment variables
5. Railway auto-detects Python and deploys

### Vercel Serverless Functions (Alternative)
If you want to use Vercel for both frontend and backend:
1. Convert FastAPI routes to serverless functions
2. Deploy entire project to Vercel
3. (Requires code restructuring)

---

## 📁 Project Structure for Deployment

```
ecocode/
├── app/                  # Backend Python code
├── src/                  # Frontend React code
├── public/               # Frontend public assets
├── requirements.txt      # Python dependencies
├── package.json          # Node dependencies
├── netlify.toml         # Netlify config ✅ Created
├── render.yaml          # Render config ✅ Created
├── .env                 # Local development (DO NOT COMMIT)
├── .env.production      # Production template ✅ Created
└── DEPLOYMENT_GUIDE.md  # This file ✅ Created
```

---

## 🔒 Security Checklist

- ✅ Never commit `.env` to GitHub
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables in Render/Netlify
- ✅ Set `DEBUG=False` in production
- ✅ Use HTTPS for all API calls
- ✅ Update CORS allowed origins
- ✅ Keep API keys secure

---

## 🐛 Troubleshooting

### Frontend can't reach backend
**Problem**: CORS errors or API calls failing

**Solution**:
1. Check `REACT_APP_API_URL` in Netlify env vars
2. Verify `ALLOWED_ORIGINS` in Render includes Netlify URL
3. Ensure backend is deployed and running

### Backend deployment fails
**Problem**: Build or start command errors

**Solution**:
1. Check Render logs for specific errors
2. Verify `requirements.txt` is complete
3. Ensure `PORT` environment variable is used: `--port $PORT`

### Database connection fails
**Problem**: Backend can't connect to NeonDB

**Solution**:
1. Verify `DATABASE_URL` in Render env vars
2. Check NeonDB is active (may sleep on free tier)
3. Ensure connection string includes `?sslmode=require`

---

## 💰 Cost Estimate

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Netlify** | 100GB bandwidth/month | 300 build minutes/month |
| **Render** | 750 hours/month | Sleeps after 15 min inactivity |
| **NeonDB** | 1 project | 3GB storage |

**Total**: $0/month for hobby projects! 🎉

---

## 🔄 Continuous Deployment

Both Netlify and Render support automatic deployment:
- Push to `main` branch → Auto-deploy
- Pull request → Preview deployment
- Rollback available if needed

---

## 📞 Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **NeonDB Docs**: https://neon.tech/docs

---

## 🎉 Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend to Render
- [ ] Copy backend URL
- [ ] Deploy frontend to Netlify
- [ ] Add environment variables to Netlify (with backend URL)
- [ ] Update CORS in Render (with Netlify URL)
- [ ] Test both services
- [ ] Celebrate! 🎊

---

**Your application is now live and accessible worldwide!** 🌍🚀
