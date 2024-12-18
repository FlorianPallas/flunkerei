FROM node:22-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

ADD package.json .
ADD pnpm-lock.yaml .
ADD pnpm-workspace.yaml .
ADD server/package.json ./server/

RUN pnpm install --frozen-lockfile

ADD . .

ENTRYPOINT [ "node", "./server" ]
EXPOSE 3000