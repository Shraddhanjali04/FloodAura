# ⚡ Quick Deploy - 10 Minute Setup

## 🚀 Deploy in 3 Steps

### Step 1: Deploy Backend (5 minutes)

1. **Go to Render.com**
   ```
   https://dashboard.render.com/select-repo
   ```

2. **Connect GitHub & Configure**
   - Select your repository
   - Name: `ecocode-backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   Copy-paste this into Render:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_6fH7gSdRxTpX@ep-nameless-mud-adtrjmjk-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   OPENWEATHERMAP_API_KEY=68e1583c818816fac3a7f297540898ad
   GEMINI_API_KEY=AIzaSyAL3ouFdIzxhTnXXgeGFvpCL65OpkI0Q8A
   SECRET_KEY=627e87d4391226adb0646d4f0c9b760e205c0dec8f05de73a1ef0804dac53631
   DEBUG=False
   ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Deploy & Copy URL**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy URL: `https://ecocode-backend-xxxx.onrender.com`

---

### Step 2: Deploy Frontend (3 minutes)

1. **Go to Netlify**
   ```
   https://app.netlify.com/start
   ```

2. **Import from GitHub**
   - Select your repository
   - Build: `npm run build`
   - Publish: `build`

3. **Add Environment Variable**
   Go to Site settings → Environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url-from-step1.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy site"
   - Copy URL: `https://your-app.netlify.app`

---

### Step 3: Connect Them (2 minutes)

1. **Update Backend CORS**
   - Go back to Render
   - Edit `ALLOWED_ORIGINS` variable:
   ```
   ALLOWED_ORIGINS=https://your-app.netlify.app,http://localhost:3000
   ```

2. **Test**
   Visit your Netlify URL and verify everything works!

---

## ✅ Done!

Your app is now live:
- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-backend.onrender.com
- **Database**: Already configured ✅

---

## 🆘 Need Help?

See detailed guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
