# Quick Render Deployment Guide

## 🚀 Deploy to Render in 5 Minutes

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub repository: `mobile_recharege_app`

### Step 2: Deploy Backend
1. Click **"New"** → **"Web Service"**
2. Select your repository: `mobile_recharege_app`
3. Configure:
   - **Name**: `mobile-recharge-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: `Free`

4. **Environment Variables** (Add these):
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recharge-app
   ```

### Step 3: Setup Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster
3. Create database user
4. Get connection string
5. Add connection string to `MONGODB_URI` in Render

### Step 4: Deploy Frontend
1. Click **"New"** → **"Static Site"**
2. Select same repository: `mobile_recharege_app`
3. Configure:
   - **Name**: `mobile-recharge-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://mobile-recharge-backend.onrender.com/api
   ```

### Step 5: Test Your App
1. Backend URL: `https://mobile-recharge-backend.onrender.com`
2. Frontend URL: `https://mobile-recharge-frontend.onrender.com`
3. Test login: `user@demo.com` / `password123`

## 📝 Important Notes

- **Free Tier Limitations**: Apps sleep after 15 minutes of inactivity
- **Cold Starts**: First request may take 30+ seconds
- **Database**: Use MongoDB Atlas free tier (512MB)
- **CORS**: Already configured for production

## 🔧 Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recharge-app
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://mobile-recharge-backend.onrender.com/api
```

## 🎯 Quick MongoDB Atlas Setup
1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create new project
3. Build database (free M0 cluster)
4. Create database user (username/password)
5. Add IP address (0.0.0.0/0 for all IPs)
6. Get connection string from "Connect" → "Connect your application"
7. Replace `<password>` with your database user password

## 🔗 Repository
Your code is now available at: https://github.com/Sivasathya07/mobile_recharege_app

## 🆘 Troubleshooting
- **Build fails**: Check Node.js version compatibility
- **Database connection**: Verify MongoDB URI and network access
- **API calls fail**: Check CORS and API URL configuration
- **App not loading**: Check build logs in Render dashboard

## 📱 Demo Credentials
- **User**: user@demo.com / password123
- **Admin**: admin@demo.com / admin123