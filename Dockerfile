# DOCKERFILE ULTRA-FORȚAT PENTRU RAILWAY - VA AFISA ABSOLUT TOT
FROM node:20-alpine

# Instalăm bash pentru scripturi complexe
RUN apk add --no-cache curl net-tools bash

WORKDIR /app

# Copiem scriptul FORȚAT
COPY railway-start-forced.sh ./
RUN chmod +x railway-start-forced.sh

# Copiem fișierele de configurare
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Instalăm dependențele
RUN cd server && npm ci --only=production

# Copiem codul compilat
COPY server/dist ./server/dist

# Verificare EXTREMĂ a fișierelor
RUN echo "🔥🔥🔥 VERIFICARE EXTREMA 🔥🔥🔥" && \
    echo "📁 Director curent: $(pwd)" && \
    echo "📁 Conținut /app: $(ls -la)" && \
    echo "📁 Conținut server: $(ls -la server/)" && \
    echo "📁 Conținut server/dist: $(ls -la server/dist/)" && \
    test -f server/dist/app.js && echo "✅✅✅ APP.JS EXISTA!" || echo "❌❌❌ APP.JS LIPSESTE!" && \
    test -x railway-start-forced.sh && echo "✅✅✅ SCRIPT EXECUTABIL!" || echo "❌❌❌ SCRIPT NEEXECUTABIL!"

# Healthcheck cu logging
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD echo "=== HEALTHCHECK RULAT ===" && \
      echo "Time: $(date)" && \
      echo "Port: ${PORT:-5000}" && \
      echo "Attempting healthcheck..." && \
      curl -f -v http://localhost:${PORT:-5000}/api/health && echo "✅ HEALTH SUCCESS" || (echo "❌ HEALTH FAILED"; exit 1)

# FOLOSIM SCRIPTUL FORȚAT - Railway VA FI OBLIGAT SĂ-L RULEZE
CMD ["./railway-start-forced.sh"]