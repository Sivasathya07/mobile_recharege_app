# Deployment Guide for Render

## Prerequisites
1. GitHub repository: https://github.com/Sivasathya07/mobile_recharege_app
2. Render account: https://render.com

## Deployment Steps

### 1. Backend Deployment
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: mobile-recharge-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `PORT`: 10000
     - `MONGODB_URI`: (will be auto-generated with database)
     - `JWT_SECRET`: (generate a secure random string)

### 2. Database Setup
1. In Render Dashboard, click "New" → "PostgreSQL" (or use MongoDB Atlas)
2. For MongoDB Atlas:
   - Create account at https://cloud.mongodb.com
   - Create cluster
   - Get connection string
   - Add to MONGODB_URI environment variable

### 3. Frontend Deployment
1. In Render Dashboard, click "New" → "Static Site"
2. Connect same GitHub repository
3. Configure:
   - **Name**: mobile-recharge-frontend
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: https://mobile-recharge-backend.onrender.com/api

### 4. Environment Variables
Backend (.env):
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Frontend (.env.production):
```
REACT_APP_API_URL=https://mobile-recharge-backend.onrender.com/api
```

## Post-Deployment
1. Test the application
2. Update CORS settings if needed
3. Monitor logs for any issues
4. Set up custom domain (optional)

## Important Notes
- Free tier has limitations (sleeps after 15 minutes of inactivity)
- Database connections may timeout - implement reconnection logic
- Use environment variables for all sensitive data
- Enable HTTPS in production