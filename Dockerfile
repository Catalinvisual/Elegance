FROM node:20-alpine

WORKDIR /app

# Copiere server
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server
RUN cd server && npm run build

# Copiere client build în locația corectă
RUN mkdir -p ./server/client-build
COPY client/build ./server/client-build

EXPOSE 5000

WORKDIR /app/server
CMD ["node", "dist/app.js"]