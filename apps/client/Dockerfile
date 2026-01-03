# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY apps/client/package*.json ./

# Install dependencies
RUN npm install

# Copy client source code
COPY apps/client ./

# Build-time environment variables
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Default nginx config is usually fine for SPA if we add a small tweak for routing
# but for now let's use the default.
# EXPOSE 80 is default for nginx:stable-alpine

CMD ["nginx", "-g", "daemon off;"]