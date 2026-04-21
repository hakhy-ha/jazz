#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Generating Prisma client..."
npm run prisma:generate

echo "Build completed successfully!"