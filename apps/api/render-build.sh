#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npm run --workspace @jazz/api prisma:generate

echo "Building API..."
npm run --workspace @jazz/api build

echo "Build completed successfully!"