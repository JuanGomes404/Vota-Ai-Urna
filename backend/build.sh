#!/bin/bash
# Build script for Render deployment

set -e  # Exit on error

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma Client..."
cd database
npx prisma generate
cd ..

echo "🏗️ Building NestJS application..."
npx nest build

echo "✅ Checking build output..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files:"
    ls -la dist/ | head -20
else
    echo "❌ Error: dist/main.js not found!"
    echo "📁 Current directory:"
    pwd
    echo "📁 Directory contents:"
    ls -la
    echo "📁 Checking if dist exists:"
    if [ -d "dist" ]; then
        echo "dist directory exists, contents:"
        find dist -type f | head -20
    else
        echo "dist directory does not exist!"
    fi
    exit 1
fi
