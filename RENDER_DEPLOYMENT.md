# BackdropAI Backend Deployment on Render

This guide will help you deploy your BackdropAI backend on Render.

## Prerequisites

1. A Render account (free tier available)
2. Your GitHub repository connected to Render
3. API keys for external services (if needed)

## Step 1: Prepare Your Repository

Your repository should have the following structure:
```
BackdropAI--main/
├── backend.py              # Your FastAPI application
├── requirements.txt        # Python dependencies
├── render.yaml            # Render configuration
└── .gitignore             # Git ignore file
```

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. **Push your code to GitHub** with the updated `render.yaml` file
2. **Go to Render Dashboard** → https://dashboard.render.com
3. **Click "New +"** → **"Blueprint"**
4. **Connect your GitHub repository**
5. **Select the repository** containing your BackdropAI project
6. **Render will automatically detect** the `render.yaml` file
7. **Click "Apply"** to start the deployment

### Option B: Manual Deployment

1. **Go to Render Dashboard** → https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `backdropai-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or choose paid plan for better performance)

## Step 3: Configure Environment Variables

In your Render service dashboard, go to **Environment** tab and add:

```
UNSCREEN_API_KEY=your_unscreen_api_key_here
REPLICATE_API_TOKEN=your_replicate_token_here
U2NET_HOME=/opt/render/project/src/.u2net
```

## Step 4: Update Frontend Configuration

After deployment, update your frontend to point to the new backend URL:

1. **Get your Render service URL** (e.g., `https://backdropai-backend.onrender.com`)
2. **Update your frontend environment variables**:
   ```env
   REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
   ```

## Step 5: Test Your Deployment

1. **Visit your backend URL** + `/health` to check if it's running
2. **Test the API endpoints** using tools like Postman or curl
3. **Check the logs** in Render dashboard for any errors

## Important Notes

### Model File
- The `u2net.pth` model file (168MB) will be downloaded during the build process
- This ensures the model is available in the deployed environment
- The download happens automatically via the build command in `render.yaml`

### Free Tier Limitations
- **Sleep after inactivity**: Free services sleep after 15 minutes of inactivity
- **Cold start**: First request after sleep may take 30-60 seconds
- **Bandwidth limits**: Check Render's current free tier limits

## API Endpoints

Your backend should expose these endpoints:
- `GET /` - Health check
- `POST /removebg` - Remove background from image
- `POST /remove-video-bg` - Remove background from video
- `GET /video-status/{job_id}` - Check video processing status

## Support

- **Render Documentation**: https://render.com/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **BackdropAI Issues**: Check your repository's issues section 