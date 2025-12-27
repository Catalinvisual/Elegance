# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build the application
RUN cd client && npm run build
RUN cd server && npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server/dist/app.js"]