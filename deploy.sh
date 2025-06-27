#!/bin/bash

# Deployment script for Backfree Background Removal App

echo "🚀 Starting Backfree deployment process..."

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
echo "📦 Building Backfree project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying Backfree to Vercel..."
vercel --prod

echo "🎉 Backfree deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set REACT_APP_BACKEND_URL environment variable in Vercel dashboard"
echo "   2. Deploy your backend to Render/Railway/Heroku"
echo "   3. Update the backend URL in your environment variables" 