#!/bin/sh

echo "🔄 Inicializando Vota Ai..."

# Gerar Prisma Client
echo "📊 Gerando Prisma Client..."
npx prisma generate --schema=./database/prisma/schema.prisma

# Executar migrações (se necessário)
echo "🗄️ Executando migrações..."
npx prisma migrate deploy --schema=./database/prisma/schema.prisma

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
node dist/src/main.js
