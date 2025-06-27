# Deployment Guide - Backfree

This guide will help you deploy your Backfree background removal application to production.

## Backend Deployment

### Option 1: Render (Recommended - Free)

1. **Create a Render account** at https://render.com
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `backfree-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn remove_bg_server:app --bind 0.0.0.0:$PORT`
   - **Plan**: Free

5. **Add Environment Variables:**
   - `UNSCREEN_API_KEY`: Your Unscreen API key
   - `REPLICATE_API_TOKEN`: Your Replicate API token (optional)

6. **Deploy** and note the URL (e.g., `https://backfree-backend.onrender.com`)

### Option 2: Railway

1. **Create a Railway account** at https://railway.app
2. **Create a new project**
3. **Deploy from GitHub**
4. **Add environment variables** as above
5. **Deploy** and note the URL

### Option 3: Heroku

1. **Create a Heroku account** at https://heroku.com
2. **Install Heroku CLI**
3. **Create a new app:**
   ```bash
   heroku create your-bg-remover-backend
   ```
4. **Add environment variables:**
   ```bash
   heroku config:set UNSCREEN_API_KEY=your_key_here
   heroku config:set REPLICATE_API_TOKEN=your_token_here
   ```
5. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

## Frontend Deployment (Vercel)

### Prerequisites

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Update backend URL** in your environment variables

### Deployment Steps

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Set environment variables:**
   ```bash
   vercel env add REACT_APP_BACKEND_URL
   # Enter your backend URL (e.g., https://backfree-backend.onrender.com)
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Or deploy through Vercel Dashboard:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set environment variables in the dashboard
   - Deploy

### Environment Variables for Frontend

Create a `.env.local` file in your project root:

```env
REACT_APP_BACKEND_URL=https://backfree-backend.onrender.com
```

## Testing Deployment

1. **Test backend health:**
   ```
   GET https://backfree-backend.onrender.com/health
   ```

2. **Test frontend:**
   - Visit your Vercel URL
   - Try uploading an image/video
   - Check if background removal works

## Troubleshooting

### Backend Issues

1. **Build fails:**
   - Check `requirements.txt` for correct versions
   - Ensure all dependencies are listed

2. **Runtime errors:**
   - Check logs in your deployment platform
   - Verify environment variables are set correctly

3. **CORS errors:**
   - Backend already has CORS configured
   - If issues persist, check if your deployment platform blocks requests

### Frontend Issues

1. **Backend connection fails:**
   - Verify `REACT_APP_BACKEND_URL` is set correctly
   - Check if backend is running and accessible
   - Test backend health endpoint

2. **Build errors:**
   - Check for TypeScript errors
   - Ensure all imports are correct

## Security Considerations

1. **API Keys:**
   - Never commit API keys to version control
   - Use environment variables for all sensitive data
   - Rotate API keys regularly

2. **CORS:**
   - Backend is configured to allow all origins for development
   - Consider restricting CORS in production to your frontend domain

3. **File Upload:**
   - Consider adding file size limits
   - Validate file types on both frontend and backend

## Monitoring

1. **Backend monitoring:**
   - Use your deployment platform's logging
   - Monitor API usage and costs
   - Set up alerts for errors

2. **Frontend monitoring:**
   - Use Vercel Analytics
   - Monitor user interactions
   - Track performance metrics

## Cost Optimization

1. **Free tier limits:**
   - Render: 750 hours/month
   - Railway: $5 credit/month
   - Heroku: Sleeps after 30 minutes of inactivity
   - Vercel: 100GB bandwidth/month

2. **API costs:**
   - Unscreen: 10 videos/month free
   - Monitor usage to avoid unexpected charges

## Next Steps

1. **Set up custom domain** (optional)
2. **Add monitoring and analytics**
3. **Implement user authentication**
4. **Add rate limiting**
5. **Set up CI/CD pipeline** 