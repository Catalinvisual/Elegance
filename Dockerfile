# Dockerfile cu LOGGING MAXIM
FROM node:20-alpine

# Instalăm utilități pentru debugging
RUN apk add --no-cache curl net-tools

WORKDIR /app/server

# Copiem serverul
COPY server/package*.json ./
COPY server/dist ./dist

# Instalăm dependențele
RUN npm ci --only=production

# Script de debugging pentru Railway
RUN echo '#!/bin/bash' > /start-debug.sh && \
    echo 'echo "🔥 RAILWAY CONTAINER STARTING..."' >> /start-debug.sh && \
    echo 'echo "📅 $(date)"' >> /start-debug.sh && \
    echo 'echo "📁 Working directory: $(pwd)"' >> /start-debug.sh && \
    echo 'echo "🔧 Environment:"' >> /start-debug.sh && \
    echo 'env | grep -E "(PORT|NODE_ENV|RAILWAY)" | sort' >> /start-debug.sh && \
    echo 'echo ""' >> /start-debug.sh && \
    echo 'echo "📂 Directory contents:"' >> /start-debug.sh && \
    echo 'ls -la' >> /start-debug.sh && \
    echo 'echo ""' >> /start-debug.sh && \
    echo 'echo "🌐 Port check:"' >> /start-debug.sh && \
    echo 'netstat -tuln' >> /start-debug.sh && \
    echo 'echo ""' >> /start-debug.sh && \
    echo 'echo "🚀 STARTING NODE APPLICATION..."' >> /start-debug.sh && \
    echo 'exec node dist/app.js' >> /start-debug.sh && \
    chmod +x /start-debug.sh

# EXPUNEM portul
EXPOSE 5000

# Pornim cu debugging maxim
CMD ["/bin/bash", "-c", "/start-debug.sh"]