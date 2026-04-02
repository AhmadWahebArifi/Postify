# Postify Deployment Guide

## Frontend Deployment on Vercel

### Prerequisites
- Vercel account
- GitHub repository with the frontend code

### Steps
1. **Push to GitHub**
   ```bash
   cd frontend/frontend
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend/frontend` directory
   - Click "Deploy"

3. **Environment Variables**
   - After deployment, go to project settings
   - Add environment variable:
     - `VITE_API_URL`: Your Render backend URL (e.g., `https://postify-backend.onrender.com`)

4. **Redeploy**
   - After adding environment variables, trigger a redeploy

## Backend Deployment on Render

### Prerequisites
- Render account
- MongoDB Atlas database

### Steps
1. **Push to GitHub**
   ```bash
   cd backend
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory
   - Configure:
     - Name: `postify-backend`
     - Runtime: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: `Free`

3. **Environment Variables**
   Add these environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: `10000` (Render's default port)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Post-Deployment Checklist

### Backend (Render)
- [ ] Health check accessible at `https://your-app.onrender.com/health`
- [ ] API endpoints working correctly
- [ ] MongoDB connection established
- [ ] Environment variables configured

### Frontend (Vercel)
- [ ] Site loads without errors
- [ ] API calls reach the backend
- [ ] Authentication works
- [ ] Post creation, liking, and commenting work

### Testing
1. Visit your Vercel URL
2. Try to register/login
3. Create a post
4. Like and comment on posts
5. Verify all features work end-to-end

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows frontend origin
2. **API Connection**: Check `VITE_API_URL` is correct
3. **Database Connection**: Verify MongoDB URI is accessible
4. **Environment Variables**: Ensure all required variables are set

### Logs
- **Vercel**: Check dashboard for deployment logs
- **Render**: Check "Logs" tab in service dashboard

## URLs Structure
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`
- Health Check: `https://your-backend.onrender.com/health`
