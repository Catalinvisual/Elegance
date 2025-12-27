# DOCKERFILE ULTRA-MINIMAL - DOAR SERVER ȘI ATÂT
FROM node:20-alpine

WORKDIR /app

# Copiem și pornim - nimic altceva
COPY server/package*.json ./server/
COPY server/dist ./server/dist

RUN cd server && npm ci --only=production

# Cel mai simplu CMD posibil
CMD node server/dist/app.js