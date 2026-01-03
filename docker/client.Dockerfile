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

# Copy custom nginx config for SPA routing
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]