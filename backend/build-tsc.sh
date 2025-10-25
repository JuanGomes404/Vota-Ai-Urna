#!/bin/bash
# Alternative build script using TypeScript compiler directly

set -e

echo "📦 Installing all dependencies..."
npm install

echo "🔧 Generating Prisma Client..."
cd database
npx prisma generate
cd ..

echo "🧹 Cleaning dist directory..."
rm -rf dist

echo "🏗️ Compiling TypeScript..."
npx tsc -p tsconfig.build.json

echo "✅ Checking build output..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files in dist/:"
    ls -la dist/
else
    echo "❌ Error: dist/main.js not found!"
    exit 1
fi
