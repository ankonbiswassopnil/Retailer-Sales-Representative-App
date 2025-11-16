# Use Node.js 20 LTS as base image, specifying amd64 platform (from previous fix)
FROM --platform=linux/amd64 node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Install NestJS CLI globally for development (optional, but useful)
RUN npm install -g @nestjs/cli

# Build the app for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command for development (with hot-reload)
CMD ["npm", "run", "start:dev"]

# For production, use: CMD ["npm", "run", "start:prod"]