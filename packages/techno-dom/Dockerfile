FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package.json .
# install all deps (including dev) so `next build` can run
RUN npm install --no-audit --no-fund
COPY . .
# fail the build if Next.js build fails so we see the error
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app .
# remove dev dependencies to slim image
RUN npm prune --production || true
EXPOSE 3000
CMD ["npm", "run", "start"]
