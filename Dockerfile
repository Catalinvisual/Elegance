# DOCKERFILE ULTRA-MINIMAL - DOAR SERVER ȘI ATÂT
FROM node:20-alpine

# Instalăm curl pentru healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copiem și pornim - nimic altceva
COPY server/package*.json ./server/
COPY server/dist ./server/dist

RUN cd server && npm ci --only=production

# HEALTHCHECK pentru Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Cel mai simplu CMD posibil
CMD node server/dist/app.js