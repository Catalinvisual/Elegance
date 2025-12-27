#!/bin/sh
# Startup script pentru Railway - adaugă o mică întârziere pentru stabilizare

echo "🚀 Starting Beauty Salon Server..."
echo "⏳ Waiting 5 seconds for container stabilization..."
sleep 5

echo "📁 Current directory: $(pwd)"
echo "📂 Files in current directory: $(ls -la)"
echo "🔍 Checking if dist directory exists..."
ls -la dist/ || echo "❌ dist directory not found"

echo "🎯 Starting Node.js server..."
node dist/app.js