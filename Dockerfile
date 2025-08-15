# AEGES Production Dockerfile
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S aeges && \
    adduser -S aeges -u 1001

# Copy application code
COPY . .

# Set proper permissions
RUN chown -R aeges:aeges /app
USER aeges

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node health-check.js

# Security labels
LABEL security.scan="completed" \
      maintainer="AEGES Team <team@aeges.org>" \
      version="1.2.0"

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server.js"]
