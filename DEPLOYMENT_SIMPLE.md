# 🚀 BackdropAI Deployment Guide - Render (Simple)

## Overview
This guide will help you deploy BackdropAI on Render using a simple Node.js backend.

## Prerequisites
1. **GitHub Repository** - Your code should be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)

## Step 1: Deploy on Render

### 1.1 Create Web Service
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Yash0162004/BackdropAI-`

### 1.2 Configure Service
- **Name**: `backdropai`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 1.3 Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (3-5 minutes)
3. Your app will be live at: `https://backdropai.onrender.com`

## Step 2: Test Your Deployment

### 2.1 Health Check
Visit: `https://backdropai.onrender.com/health`
Expected response:
```json
{
  "status": "healthy",
  "service": "backdropai-backend",
  "message": "BackdropAI server is running"
}
```

### 2.2 Test Image Upload
1. Go to your app URL
2. Upload an image
3. Currently returns the original image (placeholder)

## Step 3: Add Background Removal

You can add background removal functionality by:

### Option 1: Local Processing
- Use TensorFlow.js in the browser
- Use MediaPipe for selfie segmentation
- Use Canvas API for simple processing

### Option 2: Server-Side Processing
- Add image processing libraries to the Node.js server
- Use Sharp or Jimp for image manipulation
- Implement custom algorithms

### Option 3: External Services
- Add support for multiple background removal APIs
- Let users choose their preferred service
- Implement fallback mechanisms

## Environment Variables

No environment variables are required for basic deployment.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/remove-bg` | POST | Image processing (placeholder) |
| `/api/remove-video-bg` | POST | Video processing (coming soon) |

## Next Steps

1. **Add background removal functionality**
2. **Implement image processing**
3. **Add video support**
4. **Optimize performance**

Your BackdropAI app is now deployed and ready for background removal implementation! 🎉 