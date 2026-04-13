FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Utiliza env args no build se necessitar, mas o ideal para VITE_ na containerização é passar arg durante build ou lidar em runtime
ARG VITE_IMGBB_API_KEY
ENV VITE_IMGBB_API_KEY=$VITE_IMGBB_API_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Configuração SPA pro Nginx para o React Router funcionar (impedir 404 em recarregametos de páginas curtas)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
