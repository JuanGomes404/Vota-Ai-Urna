#!/bin/sh

set -e

echo "🔄 Inicializando Vota Ai..."

IS_PROD=false
LOWER_ENV=$(echo "${DB_ENV:-$NODE_ENV}" | tr '[:upper:]' '[:lower:]')
if [ "$LOWER_ENV" = "prod" ] || [ "$LOWER_ENV" = "production" ]; then
    IS_PROD=true
fi

echo "📦 Ambiente: $( [ "$IS_PROD" = true ] && echo 'production' || echo 'development' )"

# Gerar Prisma Client
echo "📊 Gerando Prisma Client..."
npx prisma generate --schema=./database/prisma/schema.prisma

# Migrações seguras (deploy em prod; dev em ambiente local)
echo "🗄️ Verificando/aplicando migrações..."
if [ "$IS_PROD" = true ]; then
    echo "🔒 Modo produção: aplicando migrações com 'prisma migrate deploy'"
    npx prisma migrate deploy --schema=./database/prisma/schema.prisma
else
    if [ ! -d "./database/prisma/migrations" ] || [ -z "$(ls -A ./database/prisma/migrations 2>/dev/null)" ]; then
        echo "📝 Primeira execução (dev) - Criando migração inicial..."
        npx prisma migrate dev --name init --schema=./database/prisma/schema.prisma --skip-generate
    else
        echo "🔄 Aplicando migrações existentes (dev)..."
        npx prisma migrate dev --schema=./database/prisma/schema.prisma --skip-generate
    fi
fi

# Executar dados iniciais somente em desenvolvimento, se solicitado
if [ "$IS_PROD" = false ]; then
    echo "📊 Verificando dados iniciais (dev)..."
    if [ -f "./database/init-data.sql" ]; then
        echo "📝 Executando script de dados iniciais (dev)..."
        if [ -n "$DATABASE_URL" ]; then
            psql "$DATABASE_URL" -f ./database/init-data.sql || echo "⚠️ Script de dados iniciais já executado ou falhou"
        elif [ -n "$POSTGRES_HOST" ] && [ -n "$POSTGRES_USER" ] && [ -n "$POSTGRES_DB" ]; then
            PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -f ./database/init-data.sql || echo "⚠️ Script de dados iniciais já executado ou falhou"
        else
            echo "ℹ️ Variáveis de conexão não definidas; pulando seed inicial."
        fi
    fi
else
    echo "ℹ️ Produção: pulando execução de dados iniciais."
fi

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
node dist/main.js
