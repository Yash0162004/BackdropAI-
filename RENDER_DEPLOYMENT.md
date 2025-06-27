# 🚀 BackdropAI Deployment Guide - Render (Node.js + Remove.bg)

## Overview
This guide will help you deploy BackdropAI on Render using Node.js backend with Remove.bg API for high-quality background removal.

## Prerequisites
1. **Remove.bg API Key** - Get from [remove.bg/api](https://remove.bg/api)
2. **GitHub Repository** - Your code should be on GitHub
3. **Render Account** - Sign up at [render.com](https://render.com)

## Step 1: Get Remove.bg API Key

1. Go to [remove.bg/api](https://remove.bg/api)
2. Sign up for a free account
3. Get your API key (starts with `api-`)
4. **Free tier**: 50 images per month

## Step 2: Deploy on Render

### 2.1 Create Web Service
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Yash0162004/BackdropAI-`

### 2.2 Configure Service
- **Name**: `backdropai`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 2.3 Set Environment Variables
Add these in the **Environment** tab:
```
REMOVE_BG_API_KEY=api-your-actual-api-key-here
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (3-5 minutes)
3. Your app will be live at: `https://backdropai.onrender.com`

## Step 3: Test Your Deployment

### 3.1 Health Check
Visit: `https://backdropai.onrender.com/health`
Expected response:
```json
{
  "status": "healthy",
  "service": "backdropai-backend",
  "provider": "remove.bg"
}
```

### 3.2 Test Image Upload
1. Go to your app URL
2. Upload an image
3. Check if background removal works

## Step 4: Custom Domain (Optional)

1. Go to your service settings
2. Click **"Custom Domains"**
3. Add your domain (e.g., `app.backdropai.com`)
4. Update DNS records as instructed

## Troubleshooting

### Build Errors
- **Node version issues**: Render auto-detects Node version
- **Dependency issues**: Check package.json is correct
- **API key issues**: Verify environment variable is set

### Runtime Errors
- **API key not found**: Check environment variable name
- **File upload issues**: Check file size limits (10MB)
- **CORS issues**: Should be handled by the server

### Performance
- **Cold starts**: First request may be slow
- **API limits**: Monitor Remove.bg usage
- **File processing**: Large files take longer

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `REMOVE_BG_API_KEY` | Your Remove.bg API key | Yes |
| `PORT` | Server port (auto-set by Render) | No |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/remove-bg` | POST | Remove image background |
| `/api/remove-video-bg` | POST | Video background removal (coming soon) |

## Cost Optimization

- **Remove.bg**: Free tier = 50 images/month
- **Render**: Free tier available
- **Monitor usage** to avoid overages

## Support

- **Remove.bg API**: [remove.bg/api](https://remove.bg/api)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: Your repository issues

## Next Steps

1. **Monitor usage** in Remove.bg dashboard
2. **Set up alerts** for API limits
3. **Add video support** when needed
4. **Optimize performance** based on usage

Your BackdropAI app is now deployed with professional-grade background removal! 🎉 