FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY tsconfig.base.json .
COPY apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY apps/web/next.config.mjs ./apps/web/next.config.mjs
COPY apps/web/pages ./apps/web/pages
COPY apps/web/styles ./apps/web/styles
COPY apps/web/components ./apps/web/components
COPY apps/web/lib ./apps/web/lib
RUN npm install
RUN npm run build --workspace @jazz/web

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY apps/web/package.json ./package.json
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
