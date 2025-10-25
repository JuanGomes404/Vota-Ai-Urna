#!/bin/bash

# Script para build e deploy do frontend
echo "🚀 Iniciando build do frontend Vue.js..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale npm primeiro."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos gerados em: ./dist"
else
    echo "❌ Erro no build da aplicação."
    exit 1
fi

# Build da imagem Docker
echo "🐳 Fazendo build da imagem Docker..."
docker build -t vota-ai-frontend .

if [ $? -eq 0 ]; then
    echo "✅ Imagem Docker criada com sucesso!"
    echo "🏷️  Tag: vota-ai-frontend"
else
    echo "❌ Erro ao criar imagem Docker."
    exit 1
fi

echo "🎉 Frontend pronto para deploy!"
echo "💡 Para executar: docker run -p 3001:80 vota-ai-frontend"
