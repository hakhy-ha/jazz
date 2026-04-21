FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY tsconfig.base.json .
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY apps/api/src ./apps/api/src
COPY apps/api/prisma ./apps/api/prisma
RUN npm install
RUN npm run build --workspace @jazz/api

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY apps/api/package.json ./package.json
EXPOSE 5000
CMD ["node", "dist/main.js"]
