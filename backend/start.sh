#!/bin/sh

echo "🔄 Inicializando Vota Ai..."

# Gerar Prisma Client
echo "📊 Gerando Prisma Client..."
npx prisma generate --schema=./database/prisma/schema.prisma

# Verificar se existem migrações, se não, criar a inicial
echo "🗄️ Verificando migrações..."
if [ ! -d "./database/prisma/migrations" ] || [ -z "$(ls -A ./database/prisma/migrations 2>/dev/null)" ]; then
    echo "📝 Primeira execução - Criando migração inicial..."
    npx prisma migrate dev --name init --schema=./database/prisma/schema.prisma --skip-generate
else
    echo "🔄 Aplicando migrações existentes..."
    npx prisma migrate deploy --schema=./database/prisma/schema.prisma
fi

# Executar dados iniciais se necessário
echo "📊 Verificando dados iniciais..."
if [ -f "./database/init-data.sql" ]; then
    echo "📝 Executando script de dados iniciais..."
    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -f ./database/init-data.sql || echo "⚠️ Script de dados iniciais já executado ou falhou"
fi

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
node dist/src/main.js
