# Dockerfile simplificat pentru Railway - FORȚEAZĂ pornirea
FROM node:20-alpine

# Instalăm doar ce e esențial
RUN apk add --no-cache bash curl

WORKDIR /app

# Copiem totul
COPY server/package*.json ./server/
COPY server/dist ./server/dist
COPY server/railway-entrypoint.sh ./server/

# Instalăm dependențele
RUN cd server && npm ci --only=production

# Facem scriptul executabil
RUN chmod +x ./server/railway-entrypoint.sh

# EXPUNEM portul
EXPOSE 5000

# FORȚĂM pornirea cu ENTRYPOINT
ENTRYPOINT ["/bin/bash", "-c", "echo '🔥 RAILWAY CONTAINER FORCED START' && ./server/railway-entrypoint.sh"]