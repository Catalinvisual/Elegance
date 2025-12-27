FROM node:20-alpine

WORKDIR /app

# Copiere și build client
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

# Copiere și build server
COPY server/package*.json ./server/
RUN cd server && npm ci
COPY server ./server
RUN cd server && npm run build

EXPOSE 5000

CMD ["node", "server/dist/app.js"]