# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app/server

# Copiem package.json și instalăm TOATE dependențele (inclusiv typescript)
COPY server/package*.json ./
RUN npm ci

# Copiem sursele și config-ul de TypeScript
COPY server/tsconfig.json ./
COPY server/src ./src

# Compilăm TypeScript în JavaScript (folderul dist)
RUN npm run build

# Stage 2: Production - imaginea finală mică
FROM node:20-alpine
WORKDIR /app/server

# Instalăm doar dependențele de producție
COPY server/package*.json ./
RUN npm ci --only=production

# Copiem fișierele compilate din Stage 1
COPY --from=builder /app/server/dist ./dist

# Copiem build-ul de client (care e deja în repo)
COPY server/client-build ./client-build

# Pornim serverul
CMD ["node", "dist/app.js"]
