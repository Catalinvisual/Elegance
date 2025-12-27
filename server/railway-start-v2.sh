#!/bin/bash
# Railway startup script v2 - maximum debugging

echo "🚀 BEAUTY SALON SERVER - RAILWAY PRODUCTION MODE V2"
echo "=================================================="
echo "📅 Data: $(date)"
echo "🕐 Timestamp: $(date +%s)"
echo "📁 Working directory: $(pwd)"
echo "👤 User: $(whoami)"
echo "🔧 Environment Variables:"
env | grep -E "(PORT|NODE_ENV|DATABASE|RAILWAY)" | sort

echo ""
echo "📂 Verificare structură director..."
echo "-------------------------------------"
echo "Root /app contents:"
ls -la /app/
echo ""
echo "Server directory contents:"
ls -la /app/server/
echo ""
echo "Dist directory contents:"
ls -la /app/server/dist/ 2>/dev/null || echo "❌ dist directory NOT FOUND!"

echo ""
echo "🔍 Verificare fișiere critice..."
echo "---------------------------------"
if [ -f "/app/server/dist/app.js" ]; then
    echo "✅ app.js EXISTS ($(wc -c < /app/server/dist/app.js) bytes)"
    echo "📄 First 5 lines of app.js:"
    head -5 /app/server/dist/app.js
else
    echo "❌ CRITICAL: app.js NOT FOUND!"
    exit 1
fi

echo ""
echo "🔧 Testare Node.js..."
echo "---------------------"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Testăm dacă Node.js poate încărca aplicația
echo ""
echo "🧪 Testare încărcare aplicație..."
echo "---------------------------------"
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
echo "------------------------------"
echo "PORT: ${PORT:-NOT SET}"
echo "NODE_ENV: ${NODE_ENV:-NOT SET}"
echo "DATABASE_URL: ${DATABASE_URL:-NOT SET}"

echo ""
echo "🌐 Testare port disponibil..."
echo "------------------------------"
echo "Checking if port ${PORT:-5000} is available..."
netstat -tuln | grep -E ":${PORT:-5000}" || echo "✅ Port ${PORT:-5000} appears to be available"

echo ""
echo "🎯 PORNIRE SERVER - $(date)"
echo "============================"
echo "Starting server with explicit configuration..."
echo "Command: node dist/app.js"
echo "Working directory: $(pwd)"
echo "Environment: NODE_ENV=${NODE_ENV:-development} PORT=${PORT:-5000}"

# Setăm variabilele explicit pentru a ne asigura că sunt văzute
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-5000}

# Pornim serverul cu output complet și fără buffering
exec stdbuf -oL -eL node dist/app.js