#!/bin/bash
# SCRIPT DE START FORȚAT PENTRU RAILWAY - LOGGING COMPLET

echo "🔥🔥🔥 RAILWAY CONTAINER START - FORȚAT 🔥🔥🔥"
echo "📅 Data: $(date)"
echo "🕐 Timestamp: $(date +%s)"
echo "📁 Working directory: $(pwd)"
echo "👤 User: $(whoami)"
echo "🐳 Container ID: $(hostname)"
echo ""
echo "🔧 ENVIRONMENT VARIABLES:"
env | grep -E "(PORT|NODE_ENV|DATABASE|RAILWAY)" | sort
echo ""
echo "🔧 TOATE VARIABILELE DE MEDIU:"
env | sort
echo ""
echo "📂 DIRECTORY STRUCTURE:"
ls -la
echo ""
echo "📂 SERVER/DIST CONTENTS:"
ls -la server/dist/ || echo "❌ server/dist/ NU EXISTA"
echo ""
echo "🔍 PORT AVAILABILITY CHECK:"
netstat -tuln 2>/dev/null || echo "netstat not available"
echo ""
echo "🚀 PORNIRE SERVER NODE.JS..."
echo "Comandă: node server/dist/app.js"
echo "Director curent: $(pwd)"
echo "PORT: ${PORT:-5000}"
echo "NODE_ENV: ${NODE_ENV:-production}"
echo ""
echo "=== ÎNCEPERE EXECUȚIE SERVER ==="

# Executăm serverul și capturăm TOT output-ul
exec node server/dist/app.js