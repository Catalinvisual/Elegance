FROM node:20-alpine

WORKDIR /app

# Copiere doar server (rapid)
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server
RUN cd server && npm run build

EXPOSE 5000

CMD ["node", "server/dist/app.js"]