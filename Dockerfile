# DOCKERFILE ULTRA-MINIMAL - DOAR SERVER ȘI ATÂT
FROM node:20-alpine

# Instalăm curl pentru healthcheck
RUN apk add --no-cache curl

WORKDIR /app/server

# Copiem și pornim - nimic altceva
COPY server/package*.json ./
COPY server/dist ./dist

RUN npm ci --only=production

# HEALTHCHECK pentru Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Cel mai simplu CMD posibil
CMD node dist/app.js