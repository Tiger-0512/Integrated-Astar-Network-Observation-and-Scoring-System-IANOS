# Install dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./next-app/package.json ./next-app/package-lock.json ./
RUN npm ci

# Rebuild the source code
FROM node:18-alpine AS builder
WORKDIR /app
COPY ./next-app .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm install --ignore-scripts --prefer-offline

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "start"]
