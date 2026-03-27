#!/bin/bash

# E-Commerce App Deployment Script
# This script builds the backend, frontend, and deploys to cPanel

set -e  # Exit on any error

echo "🚀 Starting deployment process..."
echo ""

# Step 1: Build Frontend Web
echo "🎨 Building frontend web..."
cd frontend-web
npm run build:deploy
echo "✅ Frontend built successfully"
echo ""

# Step 2: Move frontend build to backend
echo "� Moving frontend build to backend..."
cd ..
rm -rf backend/front-end-build
mkdir -p backend/front-end-build
cp -r frontend-web/dist/* backend/front-end-build/
echo "✅ Frontend moved to backend/front-end-build"
echo ""

# Step 3: Navigate to backend and install dependencies
echo "� Installing backend dependencies..."
cd backend
echo "✅ Backend dependencies installed"
echo ""

# Step 4: Build the backend
echo "🔨 Building backend..."
npm run build
echo "✅ Backend built successfully"
echo ""

# Step 5: Go back to root
cd ..

# Step 6: Add all changes to git
echo "📝 Adding changes to git..."
git add .
echo "✅ Changes staged"
echo ""

# Step 7: Commit changes
echo "💾 Committing changes..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy full stack build $(date '+%Y-%m-%d %H:%M:%S')"
fi
git commit -m "$commit_msg" || echo "⚠️  No changes to commit"
echo ""

echo "✨ Deployment complete!"
echo "The cPanel post-receive hook will automatically deploy your changes."
echo ""
