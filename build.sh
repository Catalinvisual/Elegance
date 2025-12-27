#!/bin/bash

# Production build script for Beauty Salon App
# This script prevents build loops by using explicit commands

echo "🚀 Starting production build..."

# Build client
echo "📦 Building client..."
cd client
npm ci --omit=dev
npm run build
cd ..

# Build server
echo "⚙️ Building server..."
cd server
npm ci --omit=dev
npm run build
cd ..

echo "✅ Production build completed successfully!"
echo "📁 Client build: client/build/"
echo "📁 Server build: server/dist/"
echo ""
echo "To run the application:"
echo "cd server && npm start"