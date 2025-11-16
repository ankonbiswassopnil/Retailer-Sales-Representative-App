# Use Node 20 LTS (no platform flag – Docker picks the right one)
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci               # reproducible install

COPY . .

# Generate Prisma client *before* the TypeScript compile
RUN npx prisma generate

# Build the Nest app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]