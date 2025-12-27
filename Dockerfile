# Dockerfile ULTRA-SIMPLU - fără ENTRYPOINT, doar CMD
FROM node:20-alpine

WORKDIR /app

# Copiem serverul
COPY server/package*.json ./server/
COPY server/dist ./server/dist

# Instalăm dependențele
RUN cd server && npm ci --only=production

# EXPUNEM portul
EXPOSE 5000

# Comandă ULTRA-SIMPLĂ
CMD ["node", "server/dist/app.js"]