# --- Stage 1: Build ---
    FROM node:20.9.0-alpine AS build
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    
    # --- Stage 2: Run (Next.js) ---
    FROM node:20.9.0-alpine
    WORKDIR /app
    
    COPY --from=build /app ./
    ENV PORT=3000
    EXPOSE 3000
    
    CMD ["npm", "run", "start"]
    