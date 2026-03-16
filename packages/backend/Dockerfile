# Per-package Dockerfile (for local dev without monorepo)
# For production monorepo build, use Dockerfile.backend at root
FROM node:22-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 4000
ENV PORT=4000
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server.js"]
