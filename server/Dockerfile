# --- Stage 1: Build ---
    FROM node:20.9.0-alpine AS build
    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy the rest of your source files
    COPY . .
    
    # Compile TypeScript -> JavaScript
    RUN npm run build
    
    # --- Stage 2: Run ---
    FROM node:20.9.0-alpine
    WORKDIR /app
    
    # Copy only the build output and production dependencies
    COPY --from=build /app/dist ./dist
    COPY package*.json ./
    
    # Install only production dependencies
    RUN npm install --omit=dev
    
    ENV PORT=8081
    EXPOSE 8081
    
    # Start from compiled JS
    CMD ["node", "dist/app.js"]
    