#!/bin/sh
# Debug startup script pentru Railway

echo "🐛 BEAUTY SALON SERVER - DEBUG MODE"
echo "======================================"
echo "📅 Data: $(date)"
echo "🕐 Timestamp: $(date +%s)"
echo "📁 Working directory: $(pwd)"
echo "🔧 Environment Variables:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   DATABASE_URL: ${DATABASE_URL:-NOT SET}"
echo "   DB_HOST: ${DB_HOST:-NOT SET}"
echo "   DB_NAME: ${DB_NAME:-NOT SET}"

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
echo "🔍 Testing database connection..."
echo "--------------------------------"
# Test if we can connect to database URL
cd /app/server
node -e "
const { Sequelize } = require('sequelize');
console.log('Testing database connection...');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite:./database.sqlite', {
  dialect: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
  logging: console.log,
  dialectOptions: process.env.DATABASE_URL ? {
    ssl: { require: true, rejectUnauthorized: false }
  } : {}
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Database connection failed:', err.message);
    process.exit(1);
  });
" 2>&1

echo ""
echo "⏳ Waiting 3 seconds before starting server..."
echo "=============================================="
sleep 3

echo "🚀 Starting server with explicit error handling..."
echo "=================================================="

# Start server with explicit error handling
cd /app/server

# Start server in background
node dist/app.js 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 5

echo "🔍 Testing server health..."
echo "========================="

# Test if server is responding
for i in {1..10}; do
    echo "Health check attempt $i..."
    if curl -f -s -m 5 http://localhost:5000/api/health; then
        echo ""
        echo "✅ HEALTH CHECK PASSED! Server is running correctly."
        echo "✅ Container is ready for production traffic."
        break
    else
        echo "❌ Health check failed (attempt $i/10)"
        if [ $i -eq 10 ]; then
            echo "❌ CRITICAL: Server failed all health checks!"
            echo "📋 Killing server process..."
            kill $SERVER_PID
            echo "❌ Container will fail to start."
            exit 1
        fi
        echo "⏳ Waiting 3 seconds before retry..."
        sleep 3
    fi
done

echo ""
echo "🎯 Server is running successfully!"
echo "=================================="

# Keep the script running and show server logs
wait $SERVER_PID

echo "❌ Server exited unexpectedly!"
echo "📅 Exit time: $(date)"
echo "🔄 Container will restart if configured..."