# Dockerfile complet nou pentru Railway - fără dependență de baza de date

FROM node:20-alpine

WORKDIR /app

# Instalez mai întâi serverul
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copiez serverul construit
COPY server/dist ./server/dist
COPY server/package.json ./server/package.json

# Copiez clientul construit
COPY client/build ./client-build

# Setez variabilele de mediu pentru Railway
ENV NODE_ENV=production
ENV PORT=5000

# Explică structura pentru debugging
RUN echo "=== STRUCTURA CONTAINERULUI ===" && \
    echo "Directorul /app:" && ls -la /app && \
    echo "Directorul /app/server:" && ls -la /app/server && \
    echo "Directorul /app/client-build:" && ls -la /app/client-build && \
    echo "=== SFÂRȘIT STRUCTURĂ ==="

WORKDIR /app/server

# Comandă de start care funcționează fără baza de date
CMD ["node", "dist/app.js"]

EXPOSE 5000