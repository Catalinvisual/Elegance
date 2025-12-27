# Dockerfile PERFECT pentru Railway - Producție
FROM node:20-alpine

# Setăm directorul de lucru
WORKDIR /app

# Copiem fișierele esențiale MAI INTAI pentru caching optim
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Instalăm dependențele server-ului
RUN cd server && npm ci --only=production

# Copiem codul server-ului (build-ul final)
COPY server/dist ./server/dist

# Verificăm că fișierele există
RUN ls -la server/dist/

# Setăm variabilele de mediu pentru Railway
ENV NODE_ENV=production
ENV PORT=5000

# Healthcheck pentru Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Pornește serverul direct - fără scripturi intermediare
CMD ["node", "server/dist/app.js"]