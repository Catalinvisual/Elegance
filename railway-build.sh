#!/bin/bash
# Railway build script - includes dev dependencies for build

echo "Starting Railway build..."

# Install ALL dependencies (including dev) for build
echo "Installing client dependencies..."
cd client
npm install

echo "Installing server dependencies..."
cd ../server
npm install

# Build applications
echo "Building client..."
cd ../client
npm run build

echo "Building server..."
cd ../server
npm run build

echo "Build completed successfully!"