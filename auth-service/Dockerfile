FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
RUN bun install --frozen-lockfile

# Build
FROM deps AS build
COPY . .
RUN bun run build

# Production
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN bun install --frozen-lockfile --production

EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]