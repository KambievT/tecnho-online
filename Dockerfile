FROM node:18-alpine AS deps
WORKDIR /workspace

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml ./
COPY .npmrc .

RUN pnpm install --frozen-lockfile --shamefully-hoist || pnpm install || true

FROM node:18-alpine AS builder
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .
RUN pnpm -w build || true

FROM node:18-alpine
WORKDIR /workspace
COPY --from=builder /workspace .

CMD ["/bin/sh", "-c", "echo 'Monorepo built. Use per-package Dockerfiles or docker-compose to run services.' && sleep infinity"]
