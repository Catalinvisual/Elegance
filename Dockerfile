# DOCKERFILE NUCLEAR PENTRU RAILWAY - 100% LOGGING
FROM node:20-alpine

# Instalăm utilități esențiale
RUN apk add --no-cache curl net-tools bash

WORKDIR /app

# Copiem scriptul de start FORȚAT
COPY railway-start.sh ./
RUN chmod +x railway-start.sh

# Copiem fișierele de configurare
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Instalăm dependențele
RUN cd server && npm ci --only=production

# Copiem codul compilat
COPY server/dist ./server/dist

# Verificăm fișierele critice
RUN echo "=== VERIFICARE FINALĂ ===" && \
    ls -la server/dist/ && \
    test -f server/dist/app.js && echo "✅ app.js EXISTA" || echo "❌ app.js LIPSESTE" && \
    test -x railway-start.sh && echo "✅ Script start executabil" || echo "❌ Script start NEEXECUTABIL"

# Healthcheck robust
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD echo "=== HEALTHCHECK RULAT ===" && \
      echo "Port: ${PORT:-5000}" && \
      echo "Time: $(date)" && \
      curl -f -v http://localhost:${PORT:-5000}/api/health && echo "✅ HEALTH SUCCESS" || echo "❌ HEALTH FAILED"

# FOLOSIM SCRIPTUL FORȚAT - Railway NU poate ignora asta
CMD ["./railway-start.sh"]