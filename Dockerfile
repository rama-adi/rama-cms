# Use the official Bun image
FROM oven/bun:1.2.20-alpine AS base
WORKDIR /app

# Install dependencies (and build-only toolchain)
FROM base AS install
RUN apk add --no-cache python3 make g++ libc6-compat
# Copy lockfile(s) for better caching; support both bun.lockb and bun.lock
COPY package.json bun.lockb* bun.lock* ./
RUN bun install --frozen-lockfile

# Build the app (Strapi admin & server)
FROM base AS prerelease
ENV NODE_ENV=production
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Final runtime image
FROM base AS release
# Some native modules expect this at runtime on Alpine
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production
COPY --from=install /app/node_modules ./node_modules
COPY --from=prerelease /app ./

# Expose Strapi port & persist uploads
EXPOSE 1337/tcp
VOLUME ["/app/public/uploads"]

# Required for containerized network
ENV HOST=0.0.0.0 PORT=1337

# Run the app
USER bun
ENTRYPOINT ["bun", "run", "start"]
