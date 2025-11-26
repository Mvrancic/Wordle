#!/bin/bash

# Wordle Game Setup Script

set -e

echo "🎯 Setting up Wordle Game Unlimited..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Copy environment files
echo "📄 Setting up environment files..."
if [ ! -f ".env" ]; then
    cp env.example .env
    echo "✅ Created .env file from template"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file from template"
fi

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "  make dev              # Start development environment"
echo "  make docker-dev       # Start with Docker"
echo ""
echo "To start production:"
echo "  make docker-prod      # Start production with Docker"
echo ""
echo "Other useful commands:"
echo "  make help             # Show all available commands"
echo "  make lint             # Lint all code"
echo "  make format           # Format all code"
echo "  make build            # Build all applications"
echo ""
echo "Happy coding! 🚀"




