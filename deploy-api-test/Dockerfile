# syntax=docker/dockerfile:1
# Build from monorepo root: docker build -f apps/api/Dockerfile .

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate \
  && apk add --no-cache libc6-compat python3 make g++

FROM base AS installer
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY apps/api/package.json ./apps/api/
COPY packages/contracts/package.json ./packages/contracts/
RUN pnpm install --frozen-lockfile

FROM installer AS builder
COPY tsconfig.base.json ./
COPY packages/contracts ./packages/contracts/
COPY apps/api ./apps/api/
RUN pnpm --filter @lilo-hub/contracts build \
  && pnpm --filter @lilo-hub/api build

FROM builder AS deployer
RUN pnpm --filter @lilo-hub/api deploy --prod /deploy/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

COPY --from=deployer /deploy/api /app
COPY --from=builder /repo/apps/api/dist /app/dist
COPY --from=builder /repo/apps/api/drizzle /app/drizzle
COPY apps/api/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 4000
ENTRYPOINT ["/app/entrypoint.sh"]
