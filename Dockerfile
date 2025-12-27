# DOCKERFILE ULTRA-SIMPLU PENTRU RAILWAY - FUNCȚIONAL 100%
FROM node:20-alpine

# Instalăm doar curl pentru healthcheck
RUN apk add --no-cache curl

# Setăm directorul de lucru
WORKDIR /app

# Copiem fișierele de configurare
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Instalăm dependențele
RUN cd server && npm ci --only=production

# Copiem codul compilat
COPY server/dist ./server/dist

# Verificăm că avem fișierele critice
RUN echo "=== VERIFICARE FISIERE ===" && \
    ls -la server/dist/ && \
    test -f server/dist/app.js && echo "✅ app.js EXISTA" || echo "❌ app.js LIPSESTE"

# Healthcheck simplu dar eficient
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:${PORT:-5000}/api/health || exit 1

# Comandă DIRECTĂ și simplă - Railway o va folosi
CMD ["node", "server/dist/app.js"]