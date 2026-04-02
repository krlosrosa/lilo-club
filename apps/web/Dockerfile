# syntax=docker/dockerfile:1
# Build from monorepo root: docker build -f apps/web/Dockerfile .

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate \
  && apk add --no-cache libc6-compat

FROM base AS installer
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/clients/package.json ./packages/clients/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
RUN pnpm install --frozen-lockfile

FROM installer AS builder
WORKDIR /repo
ARG NEXT_PUBLIC_API_URL=https://example.com/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY tsconfig.base.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN pnpm turbo run build --filter=@lilo-hub/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat

COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /repo/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
