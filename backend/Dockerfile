# Multi-stage production Dockerfile for HerEarn Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for prisma generate)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Copy node_modules and Prisma generated client
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
COPY src ./src

EXPOSE 5000

# Run migrations and start server
CMD ["node", "src/server.js"]
