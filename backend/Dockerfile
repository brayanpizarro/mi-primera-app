# Imagen base oficial de Node.js
FROM node:17

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar solo package.json y lock para instalar deps primero (mejora cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto al contenedor
COPY . .

# Compilar el código TypeScript a JavaScript
RUN npm run build

# Exponer el puerto que usa tu NestJS (por defecto 3000)
EXPOSE 3000

# Comando para ejecutar en producción
CMD ["npm", "run", "start:prod"]
