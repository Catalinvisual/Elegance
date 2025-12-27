# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all source code first
COPY . .

# Install dependencies in root
RUN npm install

# Install client dependencies and build
RUN cd client && npm install && npm run build

# Install server dependencies and build  
RUN cd server && npm install && npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server/dist/app.js"]