# DOCKERFILE ULTRA-PERFECT PENTRU RAILWAY - PRODUCȚIE FINALĂ
FROM node:20-alpine

# Instalăm utilități esențiale pentru debugging și healthcheck
RUN apk add --no-cache curl net-tools

# Setăm directorul de lucru exact cum vrea Railway
WORKDIR /app

# Copiem fișierele de configurare MAI INTAI pentru caching optim
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Instalăm dependențele PRODUCȚIE doar
RUN cd server && npm ci --only=production

# Copiem codul compilat
COPY server/dist ./server/dist

# Verificăm că avem fișierele critice
RUN echo "=== VERIFICARE FISIERE CRITICE ===" && \
    ls -la server/dist/ && \
    echo "=== VERIFICARE app.js ===" && \
    test -f server/dist/app.js && echo "✅ app.js EXISTA" || echo "❌ app.js LIPSESTE"

# Setăm variabilele de mediu pentru Railway
ENV NODE_ENV=production
ENV PORT=5000

# Healthcheck integrat pentru Railway - VERIFICARE REALĂ
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD echo "=== HEALTHCHECK RULAT ===" && \
      echo "Timestamp: $(date)" && \
      echo "Port: $PORT" && \
      echo "Environment: $NODE_ENV" && \
      netstat -tuln | grep -q ":$PORT" && echo "✅ Port $PORT este deschis" || echo "❌ Port $PORT este inchis" && \
      curl -f http://localhost:$PORT/api/health && echo "✅ Healthcheck SUCCESS" || echo "❌ Healthcheck FAILED"

# Logging MASIV la pornirea containerului
RUN echo '#!/bin/bash' > /start-railway.sh && \
    echo 'echo "🔥🔥🔥 RAILWAY CONTAINER PORNIND 🔥🔥🔥"' >> /start-railway.sh && \
    echo 'echo "📅 Data: $(date)"' >> /start-railway.sh && \
    echo 'echo "🕐 Timestamp: $(date +%s)"' >> /start-railway.sh && \
    echo 'echo "📁 Working directory: $(pwd)"' >> /start-railway.sh && \
    echo 'echo "👤 User: $(whoami)"' >> /start-railway.sh && \
    echo 'echo "🔧 Environment Variables:"' >> /start-railway.sh && \
    echo 'env | grep -E "(PORT|NODE_ENV|DATABASE|RAILWAY)" | sort' >> /start-railway.sh && \
    echo 'echo ""' >> /start-railway.sh && \
    echo 'echo "📂 Verificare structură director:"' >> /start-railway.sh && \
    echo 'ls -la' >> /start-railway.sh && \
    echo 'echo ""' >> /start-railway.sh && \
    echo 'echo "📂 Verificare server/dist:"' >> /start-railway.sh && \
    echo 'ls -la server/dist/' >> /start-railway.sh && \
    echo 'echo ""' >> /start-railway.sh && \
    echo 'echo "🔍 Verificare port disponibil:"' >> /start-railway.sh && \
    echo 'netstat -tuln' >> /start-railway.sh && \
    echo 'echo ""' >> /start-railway.sh && \
    echo 'echo "🚀 PORNIRE SERVER NODE.JS..."' >> /start-railway.sh && \
    echo 'echo "Comandă: node server/dist/app.js"' >> /start-railway.sh && \
    echo 'echo "Director: $(pwd)"' >> /start-railway.sh && \
    echo 'echo "Port: $PORT"' >> /start-railway.sh && \
    echo 'echo ""' >> /start-railway.sh && \
    echo 'exec node server/dist/app.js' >> /start-railway.sh && \
    chmod +x /start-railway.sh

# Expunem portul pentru Railway
EXPOSE 5000

# Pornim cu scriptul nostru de debugging
CMD ["/bin/sh", "/start-railway.sh"]