#!/bin/bash
# SCRIPT FORȚAT - RAILWAY VA FI OBLIGAT SĂ ARATE LOGURILE

# FORȚĂM OUTPUT IMEDIAT
exec 1> >(tee -a /proc/1/fd/1)
exec 2> >(tee -a /proc/1/fd/2 >&2)

echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
echo "🔥🔥🔥 RAILWAY FORȚAT SĂ ARATE LOGURI - ÎNCEPEM! 🔥🔥🔥"
echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"

# LOGĂM ABSOLUT TOT
echo "📅 DATA: $(date)"
echo "🕐 TIMESTAMP: $(date +%s)"
echo "📁 WORKING DIRECTORY: $(pwd)"
echo "👤 USER: $(whoami)"
echo "🐳 HOSTNAME: $(hostname)"
echo "🔢 PROCESS ID: $$"
echo "🌟 ARGUMENTE: $@"

# VERIFICĂM DACĂ SUNTEM ÎN CONTAINER
if [ -f /.dockerenv ]; then
    echo "✅ SUNTEM ÎN CONTAINER DOCKER"
else
    echo "⚠️  NU SUNTEM ÎN CONTAINER DOCKER"
fi

# ARĂTĂM TOATE VARIABILELE DE MEDIU
echo ""
echo "🔧 TOATE VARIABILELE DE MEDIU:"
env | sort

echo ""
echo "🔧 VARIABILE RAILWAY IMPORTANTE:"
echo "PORT: ${PORT:-LIPSESTE}"
echo "NODE_ENV: ${NODE_ENV:-LIPSESTE}"
echo "RAILWAY_ENVIRONMENT: ${RAILWAY_ENVIRONMENT:-LIPSESTE}"
echo "RAILWAY_PROJECT_ID: ${RAILWAY_PROJECT_ID:-LIPSESTE}"
echo "RAILWAY_SERVICE_ID: ${RAILWAY_SERVICE_ID:-LIPSESTE}"
echo "RAILWAY_SERVICE_NAME: ${RAILWAY_SERVICE_NAME:-LIPSESTE}"

# VERIFICĂM STRUCTURA DIRECTOARELOR
echo ""
echo "📂 STRUCTURA DIRECTOARELOR:"
ls -la /
ls -la /app || echo "❌ /app NU EXISTA"
ls -la $(pwd) || echo "❌ $(pwd) NU EXISTA"

# VERIFICĂM FIȘIERELE CRITICE
echo ""
echo "📂 VERIFICARE FIȘIERE:"
test -f server/dist/app.js && echo "✅ server/dist/app.js EXISTA" || echo "❌ server/dist/app.js LIPSESTE"
test -f railway-start.sh && echo "✅ railway-start.sh EXISTA" || echo "❌ railway-start.sh LIPSESTE"

# VERIFICĂM PORTUL
echo ""
echo "🔍 VERIFICARE PORT:"
echo "PORT: ${PORT:-5000}"
echo "Vom încerca să pornim pe portul: ${PORT:-5000}"

# ÎNCERCĂM SĂ PORNIM SERVERUL CU LOGGING MAXIM
echo ""
echo "🚀🚀🚀 PORNIRE SERVER CU LOGGING MAXIM 🚀🚀🚀"
echo "Comandă: node server/dist/app.js"
echo "Director: $(pwd)"
echo "Port: ${PORT:-5000}"
echo "Host: 0.0.0.0"

# PORNIM SERVERUL ȘI CAPTURĂM ABSOLUT TOT
echo "=== SERVER START - ÎNCEPEM EXECUȚIA ==="
exec node server/dist/app.js