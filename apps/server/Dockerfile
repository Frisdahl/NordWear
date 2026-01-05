FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Disable Prisma and NPM update checks to prevent build cache issues
# Explicitly set Prisma cache to a local folder to avoid /root/.cache issues
ENV PRISMA_SKIP_CHECKPOINT_CHECK=true
ENV PRISMA_HIDE_UPDATE_MESSAGE=true
ENV CHECKPOINT_DISABLE=1
ENV PRISMA_CACHE_DIR=/app/.prisma-cache
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

WORKDIR /app

# Copy package files for the server
COPY apps/server/package*.json ./

# Install dependencies
RUN npm install && rm -rf /root/.cache

# Copy prisma schema from root
COPY prisma ./prisma

# Copy the server source code
COPY apps/server ./

# Generate Prisma client
RUN npx prisma generate && rm -rf /root/.cache /app/.prisma-cache

# Build the server
RUN npm run build

# Make startup script executable
RUN chmod +x docker-start.sh

EXPOSE 5000

CMD ["./docker-start.sh"]