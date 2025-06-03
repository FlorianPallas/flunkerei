FROM node:22-alpine AS builder
RUN apk add --no-cache curl

RUN npm install -g pnpm
WORKDIR /app

ADD package.json .
ADD pnpm-lock.yaml .
ADD pnpm-workspace.yaml .
ADD server/package.json ./server/

RUN pnpm install --frozen-lockfile

ADD . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT [ "node", "./server" ]
EXPOSE 3000