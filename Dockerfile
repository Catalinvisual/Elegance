FROM node:20-alpine

WORKDIR /app

# Copiere director rădăcină complet
COPY . .

# Build client
RUN cd client && npm ci && npm run build

# Build server  
RUN cd server && npm ci && npm run build

EXPOSE 5000

CMD ["node", "server/dist/app.js"]