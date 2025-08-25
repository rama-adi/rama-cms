# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Speed up native deps
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy only what’s needed first for caching
COPY package*.json ./
RUN npm ci --only=production

# Now copy the app
COPY . .

# Build Strapi admin & server
ENV NODE_ENV=production
RUN npm run build

# Expose Strapi port
EXPOSE 1337

# Persist uploads (Coolify will mount a volume here)
VOLUME ["/app/public/uploads"]

# Required for containerized network
ENV HOST=0.0.0.0 PORT=1337
CMD ["npm","run","start"]
