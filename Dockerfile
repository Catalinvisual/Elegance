# Dockerfile ULTRA-SIMPLU - WORKDIR /app/server
FROM node:20-alpine

WORKDIR /app/server

# Copiem serverul direct în directorul de lucru
COPY server/package*.json ./
COPY server/dist ./dist

# Instalăm dependențele
RUN npm ci --only=production

# EXPUNEM portul
EXPOSE 5000

# Comandă ULTRA-SIMPLĂ - suntem deja în /app/server
CMD ["node", "dist/app.js"]