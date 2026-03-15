FROM node:18-alpine
WORKDIR /usr/src/app

# copy package files first for caching
COPY package.json .
RUN npm install --production --no-audit --no-fund || true

# copy entire package (including dist and prisma schema)
COPY . .

# generate prisma client if schema present
RUN npx prisma generate || true

EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/server.js"]
