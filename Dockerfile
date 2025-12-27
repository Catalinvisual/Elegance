# Stage 1: Build client
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Copy package files first - use correct paths
COPY client/package*.json ./

# Install dependencies
RUN npm ci --include=dev

# Copy source code
COPY client/ ./

# Build the client
RUN npm run build

# Stage 2: Build server
FROM node:20-alpine AS server-builder

WORKDIR /app/server

# Copy package files first - use correct paths
COPY server/package*.json ./

# Install dependencies
RUN npm ci --include=dev

# Copy source code
COPY server/ ./

# Build the server
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy server files
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# Copy client build files
COPY --from=client-builder /app/client/build ./client/build

# Copy root package files
COPY package*.json ./

# Create uploads directory
RUN mkdir -p uploads/gallery uploads/services

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "server/dist/app.js"]