# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies including devDependencies for building
RUN npm ci

# Copy full source tree
COPY . .

# Build the frontend and backend bundle
RUN npm run build

# Stage 2: Production runner stage
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json to manage production run scripts
COPY package*.json ./

# Install production dependencies only to keep image size small
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose server ingress port
EXPOSE 3000

# Execute server bundle
CMD ["npm", "run", "start"]
