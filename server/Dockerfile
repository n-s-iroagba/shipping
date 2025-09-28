# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.10.0
# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependencies first
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Build TypeScript
RUN npm run build

# Start app
CMD ["node", "dist/index.js"]
