#!/bin/bash
# Railway build script - prevents build loops

echo "🚀 Starting Railway production build..."

# Install dependencies
echo "📦 Installing dependencies..."
cd client
npm ci --omit=dev
cd ..

cd server  
npm ci --omit=dev
cd ..

# Build client
echo "🏗️ Building client..."
cd client
npm run build
cd ..

# Build server
echo "⚙️ Building server..."
cd server
npm run build
cd ..

echo "✅ Railway build completed successfully!"