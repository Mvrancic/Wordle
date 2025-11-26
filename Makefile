# Wordle Game Development Makefile

.PHONY: help install dev build lint format clean docker-setup docker-dev docker-prod test

# Default target
help:
	@echo "Wordle Game Development Commands:"
	@echo ""
	@echo "Setup Commands:"
	@echo "  install         Install all dependencies"
	@echo "  docker-setup    Setup Docker environment"
	@echo ""
	@echo "Development Commands:"
	@echo "  dev             Start development environment"
	@echo "  docker-dev      Start development with Docker"
	@echo "  docker-prod     Start production with Docker"
	@echo ""
	@echo "Build Commands:"
	@echo "  build           Build all applications"
	@echo "  build-frontend  Build frontend only"
	@echo "  build-backend   Build backend only"
	@echo ""
	@echo "Code Quality Commands:"
	@echo "  lint            Lint all code"
	@echo "  format          Format all code"
	@echo "  type-check      Type check all code"
	@echo ""
	@echo "Cleanup Commands:"
	@echo "  clean           Clean all build artifacts"
	@echo "  docker-clean    Clean Docker containers and volumes"

# Setup
install:
	@echo "Installing all dependencies..."
	npm run install:all

docker-setup:
	@echo "Setting up Docker environment..."
	docker-compose build

# Development
dev:
	@echo "Starting development environment..."
	npm run dev

docker-dev:
	@echo "Starting development with Docker..."
	docker-compose -f docker-compose.dev.yml up

docker-prod:
	@echo "Starting production with Docker..."
	docker-compose up -d

# Build
build:
	@echo "Building all applications..."
	npm run build

build-frontend:
	@echo "Building frontend..."
	npm run build:frontend

build-backend:
	@echo "Building backend..."
	npm run build:backend

# Code Quality
lint:
	@echo "Linting all code..."
	npm run lint

format:
	@echo "Formatting all code..."
	npm run format

type-check:
	@echo "Type checking all code..."
	npm run type-check

# Cleanup
clean:
	@echo "Cleaning build artifacts..."
	npm run clean

docker-clean:
	@echo "Cleaning Docker environment..."
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -f




