FROM node:22-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

ADD package.json .
ADD pnpm-lock.yaml .
ADD pnpm-workspace.yaml .
ADD client/package.json ./client/
ADD client/pnpm-lock.yaml ./client/

RUN pnpm install --frozen-lockfile

ADD . .

COPY ./client/env.prod.js ./client/public/env.js
RUN pnpm --dir ./client run build

FROM nginx:alpine AS runtime
COPY ./client/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/client/dist /usr/share/nginx/html
EXPOSE 8080