# Postify Backend Deployment Guide

## Deploy to Render

### Prerequisites
- Render account
- MongoDB Atlas database
- GitHub repository

### Step 1: Prepare MongoDB Atlas
1. Create a free MongoDB Atlas account
2. Create a new cluster (free tier)
3. Create a database user
4. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/postify?retryWrites=true&w=majority
   ```

### Step 2: Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Deploy on Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure deployment:
   - **Name**: `postify-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 4: Set Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/postify?retryWrites=true&w=majority
JWT_SECRET=your-generated-jwt-secret-here
PORT=10000
```

### Step 5: Deploy and Test
1. Click "Create Web Service"
2. Wait for deployment (2-5 minutes)
3. Test health endpoint: `https://your-app.onrender.com/health`

## API Endpoints

After deployment, your API will be available at:
```
Base URL: https://your-app.onrender.com
```

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create new post (auth required)
- `PUT /like/:id` - Like/unlike post (auth required)
- `POST /comment/:id` - Add comment (auth required)
- `DELETE /comment/:postId/:commentIndex` - Delete comment (auth required)

## Health Check
- `GET /health` - Service health status

## Monitoring
- Check Render dashboard for logs
- Monitor MongoDB Atlas for database performance
- Set up alerts for downtime

## Troubleshooting

### Common Issues
1. **Database Connection**: Verify MONGODB_URI format and network access
2. **JWT Errors**: Ensure JWT_SECRET is set and consistent
3. **Build Failures**: Check package.json and dependencies
4. **Runtime Errors**: Review logs in Render dashboard

### Debug Mode
Add this to environment variables temporarily:
```
DEBUG=*
```

## Scaling
- **Free Tier**: Limited to 750 hours/month
- **Starter Tier**: $7/month for better performance
- **Consider upgrading** for production use
