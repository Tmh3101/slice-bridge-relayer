# ===== Builder stage =====
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# ===== Stage =====
FROM node:20-alpine AS application

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bridge -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev deps for tsx)
RUN pnpm install --frozen-lockfile && \
    pnpm store prune && \
    rm -rf ~/.pnpm-store

# Copy source code and config files
COPY --chown=bridge:nodejs src ./src
COPY --chown=bridge:nodejs tsconfig.json ./
COPY --chown=bridge:nodejs drizzle ./drizzle
COPY --chown=bridge:nodejs drizzle.config.ts ./

# Copy environment template (optional, for reference)
COPY --chown=bridge:nodejs .env.example ./

# Switch to non-root user
USER bridge

# Expose port
EXPOSE 8787

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8787/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => { process.exit(1); });"

# Start the application using tsx (handles TypeScript and path aliases)
CMD ["npx", "tsx", "src/index.ts"]