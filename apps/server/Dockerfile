FROM node:20-alpine

WORKDIR /app

# Copy package files for the server
COPY apps/server/package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema from root
COPY prisma ./prisma

# Copy the server source code
COPY apps/server ./

# Generate Prisma client
RUN npx prisma generate

# Build the server

RUN npm run build



# Make startup script executable

RUN chmod +x docker-start.sh



EXPOSE 5000



CMD ["./docker-start.sh"]
