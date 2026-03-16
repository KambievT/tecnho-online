FROM node:18-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# --- Production image ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# standalone output includes everything needed
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
