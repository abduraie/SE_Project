# ============================================================================
# Dockerfile - Sprint 3 Application
# ============================================================================
# Multi-stage build for the Node.js Express application
# ============================================================================

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
