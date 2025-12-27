#!/bin/sh
# Debug startup script pentru Railway

echo "🐛 BEAUTY SALON SERVER - DEBUG MODE"
echo "======================================"
echo "📅 Data: $(date)"
echo "🕐 Timestamp: $(date +%s)"
echo "📁 Working directory: $(pwd)"
echo "🔧 Environment: $(env | grep -E '^(NODE_ENV|PORT|DATABASE)' || echo 'No env vars found')"

echo ""
echo "📂 Checking directory structure..."
echo "-----------------------------------"
ls -la /
echo ""
echo "📂 /app directory:"
ls -la /app/
echo ""
echo "📂 /app/server directory:"
ls -la /app/server/
echo ""
echo "📂 /app/client-build directory:"
ls -la /app/client-build/

echo ""
echo "🔍 Checking Node.js..."
echo "----------------------"
node --version
echo "Node path: $(which node)"

echo ""
echo "🔍 Checking npm packages..."
echo "---------------------------"
npm list --depth=0 || echo "npm list failed"

echo ""
echo "🔍 Checking dist files..."
echo "-------------------------"
if [ -f "/app/server/dist/app.js" ]; then
    echo "✅ app.js exists"
    echo "📏 Size: $(wc -c < /app/server/dist/app.js) bytes"
    echo "🔍 First 10 lines:"
    head -10 /app/server/dist/app.js
else
    echo "❌ app.js NOT found!"
fi

echo ""
echo "🔍 Testing if port 5000 is available..."
echo "-----------------------------------------"
netstat -tuln | grep 5000 || echo "Port 5000 is free"

echo ""
echo "⏳ Waiting 3 seconds before starting server..."
echo "=============================================="
sleep 3

echo "🚀 Starting server with explicit error handling..."
echo "=================================================="

# Start server with explicit error handling
cd /app/server
node dist/app.js 2>&1 | while IFS= read -r line; do
    echo "[$(date '+%H:%M:%S')] $line"
done

echo "❌ Server exited unexpectedly!"
echo "📅 Exit time: $(date)"
echo "🔄 Container will restart if configured..."