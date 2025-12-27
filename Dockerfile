# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install root dependencies
RUN npm install

# Install client dependencies and build
WORKDIR /app/client
RUN npm install && npm run build

# Install server dependencies and build
WORKDIR /app/server
RUN npm install && npm run build

# Go back to root and copy built files
WORKDIR /app
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server/dist/app.js"]