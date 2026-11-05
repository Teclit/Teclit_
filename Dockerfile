# syntax=docker/dockerfile:1

# ---- Étape 1 : dépendances (cache npm réutilisé entre builds) ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# ---- Étape 2 : build Angular (SSR + pré-rendu) ----
FROM node:22-alpine AS build
WORKDIR /app
ARG SITE_URL=""
ENV SITE_URL=$SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Étape 3 : runtime Node minimal, utilisateur non-root ----
# Le serveur SSR (server.mjs) embarque Express, helmet, Resend… : aucun node_modules requis.
FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    PORT=4000
WORKDIR /app
COPY --from=build --chown=node:node /app/dist/teclit ./dist/teclit
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/healthz || exit 1
CMD ["node", "dist/teclit/server/server.mjs"]
