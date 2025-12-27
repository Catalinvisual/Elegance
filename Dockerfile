# DOCKERFILE DIRECT - FĂRĂ SCRIPT INTERMEDIAR
FROM node:20-alpine

# Instalăm doar curl pentru healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copiem fișierele de configurare
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Instalăm dependențele
RUN cd server && npm ci --only=production

# Copiem codul compilat
COPY server/dist ./server/dist

# Verificare finală
RUN echo "=== VERIFICARE FINALĂ ===" && \
    ls -la server/dist/ && \
    test -f server/dist/app.js && echo "✅ app.js EXISTA" || echo "❌ app.js LIPSESTE"

# Healthcheck simplu
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:${PORT:-5000}/api/health || exit 1

# COMANDĂ DIRECTĂ - fără script intermediar
# Railway VA fi OBLIGAT să execute asta
CMD sh -c "echo '🔥🔥🔥 RAILWAY EXECUTA DIRECT SERVERUL! 🔥🔥🔥' && echo 'PORT: ${PORT:-5000}' && echo 'NODE_ENV: ${NODE_ENV:-production}' && echo 'Director: $(pwd)' && echo 'Fisiere:' && ls -la server/dist/ && node server/dist/app.js"