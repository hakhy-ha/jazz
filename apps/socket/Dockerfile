FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
COPY apps/socket/package.json ./apps/socket/package.json
COPY tsconfig.base.json .
COPY apps/socket/tsconfig.json ./apps/socket/tsconfig.json
COPY apps/socket/src ./apps/socket/src
RUN npm install
RUN npm run build --workspace @jazz/socket

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/socket/dist ./dist
COPY apps/socket/package.json ./package.json
EXPOSE 5001
CMD ["node", "dist/main.js"]
