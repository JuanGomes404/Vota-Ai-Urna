#!/bin/bash
# Build script for Render deployment

echo "Installing dependencies..."
npm install

echo "Generating Prisma Client..."
cd database
npx prisma generate
cd ..

echo "Building NestJS application..."
npm run build

echo "Build completed successfully!"
