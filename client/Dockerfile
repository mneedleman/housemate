# Production image: build the SPA, then serve it (and proxy the API) with Caddy.
# The Caddyfile is mounted at runtime by docker-compose.prod.yml.
FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Empty = same origin: the client calls /graphql on whatever domain served it
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM caddy:2-alpine

COPY --from=build /app/dist /srv
