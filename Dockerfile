# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This command will run your WebSocket server
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "server/index.ts"]