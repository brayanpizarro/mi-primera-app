FROM node:18

WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

COPY package*.json pnpm*-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
