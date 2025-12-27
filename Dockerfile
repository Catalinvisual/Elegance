# Dockerfile complet nou pentru Railway - DEBUG MODE

FROM node:20-alpine

# Instalăm utilități de debugging
RUN apk add --no-cache net-tools curl bash

WORKDIR /app

# Instalăm mai întâi serverul
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copiem serverul construit
COPY server/dist ./server/dist
COPY server/package.json ./server/package.json
COPY server/debug-start.sh ./server/debug-start.sh
RUN chmod +x ./server/debug-start.sh

# Copiem clientul construit
COPY client/build ./client-build

# Setăm variabilele de mediu pentru Railway
ENV NODE_ENV=production
ENV PORT=5000

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

WORKDIR /app/server

# Comandă de start cu debugging complet
CMD ["./debug-start.sh"]

EXPOSE 5000