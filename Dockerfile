# Dockerfile FINAL - fără script complex
FROM node:20-alpine

# Instalăm doar ce e esențial
RUN apk add --no-cache curl

WORKDIR /app/server

# Copiem serverul
COPY server/package*.json ./
COPY server/dist ./dist

# Instalăm dependențele
RUN npm ci --only=production

# EXPUNEM portul
EXPOSE 5000

# CMD DIRECT - fără script intermediar
CMD ["node", "dist/app.js"]