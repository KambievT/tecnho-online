FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npx prisma generate
RUN npm run build

# --- Production image ---
FROM node:18-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --production --no-audit --no-fund

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

EXPOSE 4000
ENV PORT=4000
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server.js"]
