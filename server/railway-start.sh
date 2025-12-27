#!/bin/sh
# Railway startup script - runs server in foreground

echo "🚀 BEAUTY SALON SERVER - RAILWAY PRODUCTION MODE"
echo "=============================================="
echo "📅 Data: $(date)"
echo "🕐 Timestamp: $(date +%s)"
echo "📁 Working directory: $(pwd)"
echo "🔧 Environment Variables:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   DATABASE_URL: ${DATABASE_URL:-NOT SET}"

echo ""
echo "📂 Verifying required files..."
echo "--------------------------------"
if [ -f "/app/server/dist/app.js" ]; then
    echo "✅ app.js exists ($(wc -c < /app/server/dist/app.js) bytes)"
else
    echo "❌ app.js NOT found!"
    exit 1
fi

echo ""
echo "🔍 Testing database connection..."
echo "--------------------------------"
cd /app/server
node -e "
const { Sequelize } = require('sequelize');
console.log('Testing database connection...');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite:./database.sqlite', {
  dialect: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
  logging: false,
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
    console.log('⚠️  Starting server anyway (offline mode)');
    process.exit(0);
  });
" 2>&1

echo ""
echo "🎯 Starting server in foreground..."
echo "=================================="
echo "⏳ Server will start on port ${PORT:-5000}"
echo "💓 Health check will be available at: http://0.0.0.0:${PORT:-5000}/api/health"
echo ""

# Start server directly in foreground (Railway needs this)
exec node dist/app.js