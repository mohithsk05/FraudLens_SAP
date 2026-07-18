# Stage 1: Build React Static Assets
FROM node:20-alpine AS build

WORKDIR /app

# Install package dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Nginx Web Server
FROM nginx:stable-alpine

# Copy built app from Stage 1 to Nginx HTML folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
