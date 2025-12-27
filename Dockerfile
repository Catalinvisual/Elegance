# Dockerfile complet nou pentru Railway - DEBUG MODE

FROM node:20-alpine

# Instalăm utilități de debugging și curl pentru health checks
RUN apk add --no-cache net-tools curl bash procps coreutils

WORKDIR /app

# Instalăm mai întâi serverul
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copiem serverul construit
COPY server/dist ./server/dist
COPY server/package.json ./server/package.json
COPY server/debug-start.sh ./server/debug-start.sh
COPY server/railway-start.sh ./server/railway-start.sh
COPY server/railway-start-v2.sh ./server/railway-start-v2.sh
RUN chmod +x ./server/debug-start.sh ./server/railway-start.sh ./server/railway-start-v2.sh

# Copiem clientul construit
COPY client/build ./client-build

# Setăm variabilele de mediu pentru Railway
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

# Debugging complet - verificăm TOT
RUN echo "=== DEBUGGING COMPLET STRUCTURA CONTAINERULUI ===" && \
    echo "🔍 Sistem de operare:" && cat /etc/os-release && \
    echo "" && \
    echo "🔍 Node.js versiune:" && node --version && \
    echo "" && \
    echo "🔍 Directorul /app:" && ls -la /app && \
    echo "" && \
    echo "🔍 Directorul /app/server:" && ls -la /app/server && \
    echo "" && \
    echo "🔍 Verificare app.js:" && \
    if [ -f /app/server/dist/app.js ]; then \
        echo "✅ app.js există" && \
        echo "📏 Dimensiune: $(wc -c < /app/server/dist/app.js) bytes" && \
        echo "🔍 Primele 20 linii:" && \
        head -20 /app/server/dist/app.js; \
    else \
        echo "❌ app.js LIPSEȘTE!"; \
    fi && \
    echo "" && \
    echo "🔍 Directorul /app/client-build:" && ls -la /app/client-build && \
    echo "" && \
    echo "🔍 Porturi disponibile:" && netstat -tuln && \
    echo "" && \
    echo "=== SFÂRȘIT DEBUGGING ==="

WORKDIR /app

# Comandă de start cu debugging complet - V2 cu maximum logging
# Încercăm mai întâi scriptul nostru detaliat, dacă nu merge, folosim direct node
CMD ["/bin/bash", "-c", "echo '🚀 Starting Railway deployment...' && ls -la /app/server/ && echo 'Attempting to run railway-start-v2.sh...' && ./server/railway-start-v2.sh || echo '❌ Script failed, trying direct node...' && cd /app/server && node dist/app.js"

EXPOSE 5000