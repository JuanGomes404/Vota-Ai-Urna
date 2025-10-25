#!/bin/bash
# Build script for Render deployment

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma Client..."
cd database
npx prisma generate
cd ..

echo "🏗️ Building NestJS application..."
npm run build

echo "✅ Checking build output..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files:"
    ls -la dist/
else
    echo "❌ Error: dist/main.js not found!"
    echo "📁 Current directory:"
    pwd
    echo "📁 Directory contents:"
    ls -la
    exit 1
fi
