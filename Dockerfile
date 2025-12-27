FROM node:20-alpine

WORKDIR /app

# Copiere doar server (skip client build)
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server
RUN cd server && npm run build

# Copiere client static (dacă există deja build)
COPY client/build ./client/build

EXPOSE 5000

CMD ["node", "server/dist/app.js"]