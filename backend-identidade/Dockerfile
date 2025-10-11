# Estágio 1: Builder
FROM node:20-slim AS builder
WORKDIR /app

# Copia os package.json e instala dependências primeiro para cache
COPY backend-identidade/package*.json ./backend-identidade/
COPY libs/database/package*.json ./libs/database/
RUN npm install --prefix ./backend-identidade --production=false
RUN npm install --prefix ./libs/database

# Copia o código-fonte
COPY backend-identidade/ ./backend-identidade/
COPY libs/ ./libs/

# Gera o Prisma Client e compila a aplicação
RUN npx prisma generate --schema=./libs/database/prisma/schema.prisma
WORKDIR /app/backend-identidade
RUN npm run build

# Estágio 2: Runner
FROM node:20-slim AS runner
WORKDIR /app

# Copia dependências de produção e o código compilado
COPY --from=builder /app/backend-identidade/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend-identidade/dist ./dist
COPY --from=builder /app/libs/database/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]
