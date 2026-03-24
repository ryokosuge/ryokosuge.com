FROM oven/bun:1.3 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy source
COPY src/ src/
COPY tsconfig.json ./

# Runtime
EXPOSE 3000
ENV PORT=3000
ENV SEARCH_BASE_DIR=/workspace

CMD ["bun", "run", "src/index.ts"]
