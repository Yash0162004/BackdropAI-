#!/bin/bash

# Deployment script for BackdropAI Background Removal App

echo "🚀 Starting BackdropAI deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Build the project
echo "📦 Building BackdropAI project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "�� Deploying BackdropAI to Vercel..."
vercel --prod

echo "🎉 BackdropAI deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set REACT_APP_BACKEND_URL environment variable in Vercel dashboard"
echo "   2. Deploy your backend to Render/Railway/Heroku"
echo "   3. Update the backend URL in your environment variables" 