# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim

LABEL org.opencontainers.image.title="Second Brain Dashboard"
LABEL org.opencontainers.image.description="Local reading workspace for the Hermes Obsidian vault"

# git is required for the link-fix commit flow.
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && git config --system --add safe.directory /vault \
  && git config --system --add safe.directory /repo \
  && git config --system user.name "Second Brain Dashboard" \
  && git config --system user.email "dashboard@localhost"

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --chown=node:node src ./src

RUN mkdir -p /vault && chown node:node /vault
USER node

ENV HOST=0.0.0.0 \
    PORT=8787 \
    VAULT_PATH=/vault

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 8787) + '/api/healthz').then((r) => { if (!r.ok) process.exit(1); }).catch(() => process.exit(1));"

CMD ["node", "src/server.ts"]
