FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --no-audit --no-fund || true
COPY . .
RUN npm run build || true

FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./package.json
RUN npm install --production --no-audit --no-fund || true
EXPOSE 3000
CMD ["npm", "run", "start"]
