# Dockerfile complet nou pentru Railway - fără dependență de baza de date

FROM node:20-alpine

WORKDIR /app

# Instalez mai întâi serverul
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copiez serverul construit
COPY server/dist ./server/dist
COPY server/package.json ./server/package.json
COPY server/start.sh ./server/start.sh
RUN chmod +x ./server/start.sh

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
CMD ["./start.sh"]

# Healthcheck pentru Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD node -e "const http = require('http'); const options = { host: 'localhost', port: 5000, path: '/api/health', timeout: 2000 }; const req = http.request(options, (res) => { if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); } }); req.on('error', () => { process.exit(1); }); req.on('timeout', () => { req.destroy(); process.exit(1); }); req.end();"

EXPOSE 5000