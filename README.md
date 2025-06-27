# BackdropAI - AI Background Removal Tool

A modern SaaS application for AI-powered background removal from images and videos. Built with React, TypeScript, and Flask.

## Features

### 🖼️ Image Background Removal
- Support for PNG, JPG, WebP formats
- High accuracy using U2Net AI model
- Instant processing
- Transparent background output

### 🎥 Video Background Removal
- Support for MP4, MOV, AVI formats
- Frame-by-frame AI processing
- Maintains original video quality and FPS
- Progress tracking during processing
- 100% accuracy with advanced AI models

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher

### Installation

1. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Start the Backend Server**
   ```bash
   python remove_bg_server.py
   ```

4. **Start the Frontend**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

1. Upload an image or video file
2. The system automatically detects the file type
3. For videos, processing time depends on length and resolution
4. Download your processed file with background removed

## Technical Stack

### Backend
- **Flask**: Web server framework
- **rembg**: Advanced background removal using U2Net
- **OpenCV**: Video processing and frame extraction
- **Unscreen API**: Professional video background removal
- **Pillow**: Image processing

### Frontend
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn/ui**: UI components
- **Vite**: Build tool

## Performance

- **Images**: 1-3 seconds processing time
- **Videos**: 
  - Using Unscreen API: 10-30 seconds
  - High quality output with professional results

## System Requirements

- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 2GB free space
- **GPU**: Optional but recommended for faster processing

## API Endpoints

- `POST /removebg`: Process image or video for background removal
- `GET /health`: Health check endpoint
- `GET /methods`: Get available processing methods

## Deployment

### 🚀 Quick Deployment to Vercel

1. **Deploy Backend First:**
   - Choose one of these platforms:
     - [Render](https://render.com) (Recommended - Free)
     - [Railway](https://railway.app) (Free tier available)
     - [Heroku](https://heroku.com) (Free tier available)
   
   Follow the detailed instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

2. **Deploy Frontend to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Set Environment Variables:**
   - In Vercel dashboard, add `REACT_APP_BACKEND_URL` with your backend URL
   - Example: `https://backdropai-backend.onrender.com`

### 🔧 Manual Deployment

1. **Backend Deployment:**
   ```bash
   # For Heroku
   heroku create backdropai-backend
   heroku config:set UNSCREEN_API_KEY=your_key
   git push heroku main
   ```

2. **Frontend Deployment:**
   ```bash
   npm run build
   # Deploy dist/ folder to your hosting service
   ```

### 📋 Environment Variables

Create a `.env.local` file for frontend:
```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

For backend, set these environment variables:
```env
UNSCREEN_API_KEY=your_unscreen_api_key
REPLICATE_API_TOKEN=your_replicate_token
```

## Development

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Flask
- Python AI libraries

## Support

For detailed setup instructions and troubleshooting, see [SETUP.md](./SETUP.md).

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Backend Deployment (Render)

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name**: `backdropai-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python remove_bg_server.py`
4. **Add Environment Variables:**
   - `UNSCREEN_API_KEY`: Your Unscreen API key
5. **Deploy** and note the URL (e.g., `https://backdropai-backend.onrender.com`)
