# Usar la imagen base de Nginx
FROM nginx:alpine

# Copiar el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos precompilados de Angular al directorio de Nginx
COPY dist/galileo-frontend /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 8079

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
