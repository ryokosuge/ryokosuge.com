# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.5

################################################################################
# base
FROM node:${NODE_VERSION}-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG MICROCMS_SERVICE_DOMAIN
ARG MICROCMS_API_KEY

WORKDIR /app

################################################################################
# deps
FROM base as deps

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

################################################################################
# builder
FROM base as builder

ENV MICROCMS_SERVICE_DOMAIN=${MICROCMS_SERVICE_DOMAIN}
ENV MICROCMS_API_KEY=${MICROCMS_API_KEY}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build && mv .next/static .next/standalone/.next/static

################################################################################
# runner
FROM base as runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone .

USER nextjs

ENTRYPOINT [ "node", "server.js" ]
