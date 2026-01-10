# 🚀 DEPLOY NOW - Your Code is on GitHub!

## ✅ GitHub Push Complete!

Your code is now live on GitHub: https://github.com/arnab-maity007/ecocode

---

## 🎯 Deploy in 2 Steps (10 Minutes)

### Step 1: Deploy Backend to Render (5 minutes)

**Click this link to deploy:** https://dashboard.render.com/select-repo?type=web

1. **Sign in with GitHub** (if not already)
2. **Select Repository**: `arnab-maity007/ecocode`
3. **Configure Service:**
   ```
   Name: ecocode-backend
   Region: Oregon
   Branch: main
   Root Directory: (leave empty)
   
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   
   Instance Type: Free
   ```

4. **Add Environment Variables** - Click "Advanced" and add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_6fH7gSdRxTpX@ep-nameless-mud-adtrjmjk-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   OPENWEATHERMAP_API_KEY=68e1583c818816fac3a7f297540898ad
   GEMINI_API_KEY=AIzaSyAL3ouFdIzxhTnXXgeGFvpCL65OpkI0Q8A
   SECRET_KEY=627e87d4391226adb0646d4f0c9b760e205c0dec8f05de73a1ef0804dac53631
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DEBUG=False
   ALLOWED_ORIGINS=http://localhost:3000
   ```

5. **Click "Create Web Service"**
6. **Wait 5-10 minutes** for deployment
7. **COPY YOUR BACKEND URL** (looks like: `https://ecocode-backend-xxxx.onrender.com`)

---

### Step 2: Deploy Frontend to Netlify (5 minutes)

**Click this link to deploy:** https://app.netlify.com/start

1. **Sign in with GitHub** (if not already)
2. **Click "Import from Git"** → **"GitHub"**
3. **Select Repository**: `arnab-maity007/ecocode`
4. **Configure Build:**
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: build
   ```

5. **BEFORE CLICKING DEPLOY** - Go to "Site settings" → "Environment variables"
6. **Add Environment Variable:**
   ```
   REACT_APP_API_URL=YOUR_BACKEND_URL_FROM_STEP1/api
   REACT_APP_GEMINI_API_KEY=AIzaSyAL3ouFdIzxhTnXXgeGFvpCL65OpkI0Q8A
   ```
   **⚠️ IMPORTANT**: Replace `YOUR_BACKEND_URL_FROM_STEP1` with your actual Render URL!

7. **Click "Deploy site"**
8. **Wait 3-5 minutes**
9. **COPY YOUR FRONTEND URL** (looks like: `https://your-app.netlify.app`)

---

### Step 3: Connect Them (2 minutes)

1. **Go back to Render Dashboard**
2. **Select your `ecocode-backend` service**
3. **Go to "Environment" tab**
4. **Edit `ALLOWED_ORIGINS`** and update to:
   ```
   ALLOWED_ORIGINS=https://YOUR_NETLIFY_URL,http://localhost:3000
   ```
   Replace `YOUR_NETLIFY_URL` with your actual Netlify URL from Step 2

5. **Save** - Service will auto-redeploy

---

## 🎉 That's It! Your App is Live!

**Visit your live app:**
- Frontend: `https://your-app.netlify.app`
- Backend API: `https://ecocode-backend-xxxx.onrender.com`
- API Docs: `https://ecocode-backend-xxxx.onrender.com/docs`

---

## 🧪 Test Your Deployment

```bash
# Test backend
curl https://your-backend-url.onrender.com/health

# Expected: {"status":"healthy","service":"flood-forecaster-api","database":"connected"}
```

---

## 🆘 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Netlify Dashboard**: https://app.netlify.com
- **Your GitHub Repo**: https://github.com/arnab-maity007/ecocode

---

## ⚡ Auto-Deploy Enabled!

From now on, whenever you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both Render and Netlify will automatically deploy your updates! 🚀

---

**Total Time**: ~15 minutes
**Cost**: $0/month (all free!)

**Congratulations! You're live! 🎊**
