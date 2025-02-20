# Etapa 1: Construcción del frontend (Angular)
FROM node:18 AS frontend-builder
WORKDIR /app/chat-front

# Copiar el código del frontend
COPY chat-front/ ./

# Instalar dependencias y construir la aplicación Angular
RUN npm install --force
RUN npm run build --configuration=production

# Etapa 2: Construcción del backend (Node.js)
FROM node:18 AS backend-builder
WORKDIR /app/chat-server

# Copiar archivos del backend
COPY chat-server/package*.json ./
RUN npm install

COPY chat-server/ ./

# Etapa 3: Servidor con Nginx y Node.js
FROM nginx:1.23-alpine

# Instalar Node.js en el contenedor de Nginx
RUN apk add --update nodejs npm

# Copiar la aplicación Angular al directorio de Nginx
COPY --from=frontend-builder /app/chat-front/dist/chat-front /usr/share/nginx/html

# Copiar el servidor Node.js
COPY --from=backend-builder /app/chat-server /app/chat-server

# Exponer puertos
EXPOSE 80 3000

# Ejecutar el backend y Nginx correctamente en primer plano
CMD ["sh", "-c", "node /app/chat-server/server.js & nginx -g 'daemon off;'"]