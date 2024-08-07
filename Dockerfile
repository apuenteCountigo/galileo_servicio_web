# Etapa 1: Construir la aplicación Angular
FROM node:14 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Copiar el resto del código fuente
COPY . .

# Instalar las dependencias y Construir la aplicación Angular
RUN ping 10.10.0.27 && npm install && npm run build --prod

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos por Angular al directorio de Nginx
COPY --from=build /app/dist/galileo-frontend /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
