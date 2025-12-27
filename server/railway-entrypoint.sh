#!/bin/bash
# Railway ENTRYPOINT - Forțează pornirea containerului

echo "🚨 RAILWAY ENTRYPOINT ACTIVAT!"
echo "================================"
echo "📅 Data: $(date)"
echo "🕐 Timestamp: $(date +%s)"
echo "📁 Working directory: $(pwd)"
echo "👤 User: $(whoami)"
echo ""

# Forțăm log-urile să apară imediat
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-5000}

echo "🔧 Environment Variables:"
env | grep -E "(PORT|NODE_ENV|DATABASE|RAILWAY)" | sort
echo ""

echo "📂 Verificare structură director..."
echo "Root /app contents:"
ls -la /app/
echo ""
echo "Server directory contents:"
ls -la /app/server/
echo ""

echo "🔍 Verificare fișiere critice..."
if [ -f "/app/server/dist/app.js" ]; then
    echo "✅ app.js EXISTS ($(wc -c < /app/server/dist/app.js) bytes)"
    echo "📄 First 5 lines of app.js:"
    head -5 /app/server/dist/app.js
else
    echo "❌ CRITICAL: app.js NOT FOUND!"
    echo "Contents of /app/server/dist/:"
    ls -la /app/server/dist/ 2>/dev/null || echo "❌ dist directory NOT FOUND!"
    exit 1
fi
echo ""

echo "🔧 Testare Node.js..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""

echo "🧪 Testare încărcare aplicație..."
cd /app/server
node -e "
try {
  console.log('Testing app.js loading...');
  const app = require('./dist/app.js');
  console.log('✅ App loaded successfully!');
} catch (error) {
  console.error('❌ App loading failed:', error.message);
  process.exit(1);
}
"
echo ""

echo "💾 Testare variabile mediu..."
echo "PORT: ${PORT}"
echo "NODE_ENV: ${NODE_ENV}"
echo "DATABASE_URL: ${DATABASE_URL:-NOT SET}"
echo ""

echo "🌐 Testare port disponibil..."
echo "Checking if port ${PORT} is available..."
netstat -tuln | grep -E ":${PORT}" || echo "✅ Port ${PORT} appears to be available"
echo ""

echo "🎯 PORNIRE SERVER - $(date)"
echo "=============================="
echo "Starting server with explicit configuration..."
echo "Command: node dist/app.js"
echo "Working directory: $(pwd)"
echo "Environment: NODE_ENV=${NODE_ENV} PORT=${PORT}"

# Pornim serverul cu output complet și fără buffering
echo "🚀 STARTING NODE.JS APPLICATION..."
exec node dist/app.js