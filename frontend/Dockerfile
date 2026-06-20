# syntax=docker/dockerfile:1

# ---------- Dependencias ----------
FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- Build ----------
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable

# GOTCHA: las NEXT_PUBLIC_* se inlinean en el bundle durante `next build`,
# por eso deben existir como build ARG antes de compilar. Aquí usamos BFF proxy,
# así que el valor puede ser de mismo origen; se define por compleción.
ARG NEXT_PUBLIC_API_URL=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- Runtime ----------
FROM node:24-alpine AS final
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Salida standalone de Next: server.js + solo lo necesario
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Usuario no-root incluido en la imagen node:alpine
USER node

EXPOSE 3000
CMD ["node", "server.js"]
