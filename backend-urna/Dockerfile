# Estágio 1: Builder
FROM node:20-slim AS builder
WORKDIR /app

# Copia os package.json e instala dependências primeiro para cache
COPY backend-urna/package*.json ./backend-urna/
COPY libs/database/package*.json ./libs/database/
RUN npm install --prefix ./backend-urna --production=false
RUN npm install --prefix ./libs/database

# Copia o código-fonte
COPY backend-urna/ ./backend-urna/
COPY libs/ ./libs/

# Gera o Prisma Client e compila a aplicação
RUN npx prisma generate --schema=./libs/database/prisma/schema.prisma
WORKDIR /app/backend-urna
RUN npm run build

# Estágio 2: Runner
FROM node:20-slim AS runner
WORKDIR /app

# Copia dependências de produção e o código compilado
COPY --from=builder /app/backend-urna/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend-urna/dist ./dist
COPY --from=builder /app/libs/database/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]
