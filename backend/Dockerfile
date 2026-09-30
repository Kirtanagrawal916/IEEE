# Multi-stage production Dockerfile for HerEarn Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for Prisma build
RUN apk add --no-cache openssl libc6-compat

# Copy package descriptors and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma Client
RUN npm ci
RUN npx prisma generate

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install openssl and libc6-compat for Prisma runtime on Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy node_modules, generated prisma client and source code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
COPY src ./src

EXPOSE 5000

# Run migrations and start server
CMD ["node", "src/server.js"]

