# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el resto del código fuente
COPY . .

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos por Angular al directorio de Nginx
COPY --from=build /app/dist/galileo-frontend /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 8079

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
