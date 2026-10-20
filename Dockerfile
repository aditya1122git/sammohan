# Multi-stage production Dockerfile for Sammohan Portal
FROM node:20-alpine AS client-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS server-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

RUN apk add --no-cache dumb-init

# Copy server production dependencies
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY --from=server-builder /app/backend/dist ./dist

# Copy built frontend assets
COPY --from=client-builder /app/frontend/dist /app/frontend/dist

# Create the exact upload path resolved by backend/dist/middleware/upload.js
RUN mkdir -p /app/backend/uploads && chown -R node:node /app

USER node
EXPOSE 5000

# Use dumb-init for clean signal handling (SIGTERM, SIGINT)
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/index.js"]
