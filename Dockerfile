# DOCKERFILE ULTRA-MINIMAL - DOAR SERVER ȘI ATÂT
FROM node:20-alpine

WORKDIR /app/server

# Copiem și pornim - nimic altceva
COPY server/package*.json ./
COPY server/dist ./dist
COPY server/client-build ./client-build

RUN npm ci --only=production

# Cel mai simplu CMD posibil
CMD ["node", "dist/app.js"]
