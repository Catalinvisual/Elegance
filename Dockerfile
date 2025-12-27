# Stage 1: Build client
FROM node:18-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --omit=dev

COPY client/ ./
RUN npm run build

# Stage 2: Build server
FROM node:18-alpine AS server-builder

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS production

WORKDIR /app

# Copy server files
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# Copy client build files
COPY --from=client-builder /app/client/build ./client/build

# Copy root package.json
COPY package*.json ./

# Install production dependencies for server only
RUN cd server && npm ci --omit=dev

# Create uploads directory
RUN mkdir -p uploads/gallery uploads/services

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "server/dist/app.js"]