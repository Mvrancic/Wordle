# Wordle Game Unlimited 🎯

A comprehensive Wordle game implementation featuring multiple game modes, built as a full-stack monorepo with both frontend and backend components.

## 🏗️ Repository Structure

This is a **monorepo** containing both frontend and backend components:

### Backend Structure
```
backend/
├── src/
│   ├── controllers/       # Route controllers
│   ├── services/          # Business logic
│   ├── repositories/      # Data access (Prisma)
│   ├── models/            # TypeScript types and interfaces
│   ├── schemas/           # Validation schemas (Zod)
│   ├── middleware/        # Custom middlewares
│   ├── routes/            # Route definitions
│   ├── config/            # Configuration (DB, env)
│   ├── utils/             # Utilities
│   └── types/             # Shared types
├── prisma/
│   └── schema.prisma      # Prisma schema
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Basic UI components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   ├── services/         # API calls
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
└── package.json
```

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS + React Router
- **Backend**: Express.js + TypeScript + Prisma + Supabase (PostgreSQL)
- **Architecture**: Layered architecture (controllers → services → repositories → models)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (for database)

### Installation

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup Prisma
npx prisma generate

# Copy environment file
cp env.example .env

# Edit .env and add your Supabase DATABASE_URL
# DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Run migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file (optional)
cp .env.example .env

# Start development server
npm start
```

### Running with Docker

```bash
# Development environment
docker-compose -f docker-compose.dev.yml up

# Production environment
docker-compose up
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🎮 Game Overview

This repository contains a complete Wordle game implementation that goes beyond the classic version, offering multiple exciting game modes for players of all skill levels.

### Classic Wordle Mode
The traditional Wordle experience where players attempt to guess a 5-letter word within 6 attempts. Each guess provides valuable color-coded feedback:
- 🟩 **Green**: Correct letter in the correct position
- 🟨 **Yellow**: Correct letter in the wrong position  
- ⬜ **Gray**: Letter not in the word

### Additional Game Modes

#### ⏰ Timer Mode
Race against the clock to solve words as quickly as possible, adding an exciting time-pressure element to the classic gameplay.

#### 🔤 Accented Words Mode
Challenge yourself with Spanish words that include accents and special characters, perfect for language learners and native speakers.

#### 🎬 Movie Titles Mode
Guess popular movie titles instead of regular words, combining word-guessing fun with cinema knowledge.

## 🎯 Game Features

- **Multiple Difficulty Levels**: From beginner-friendly to expert challenges
- **Responsive Design**: Play seamlessly across desktop, tablet, and mobile devices
- **Real-time Feedback**: Instant visual feedback for each guess
- **Statistics Tracking**: Keep track of your win streaks and performance
- **Customizable Themes**: Choose from various color schemes and themes
- **Multi-language Support**: Enjoy the game in different languages

## 🎲 How to Play

1. **Start a Game**: Choose your preferred game mode
2. **Make Your Guess**: Enter a valid word (5 letters for classic mode)
3. **Analyze Feedback**: Use the color clues to narrow down possibilities
4. **Strategic Guessing**: Apply logic and vocabulary knowledge to solve the puzzle
5. **Win or Learn**: Either celebrate your victory or learn from your attempts

### Tips for Success
- Start with words containing common vowels (A, E, I, O, U)
- Use words with different letter combinations to maximize information gain
- Pay attention to letter frequency in the language
- Don't repeat letters you've already eliminated

## 📊 API Endpoints

### Games
- `POST /api/games` - Create a new game
- `GET /api/games/:id` - Get game by ID
- `POST /api/games/:id/guess` - Make a guess

### Health Check
- `GET /health` - API health check

## 🧪 Development Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npm run format       # Format code
npm run type-check   # Type check
npm run prisma:studio # Open Prisma Studio
```

### Frontend
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
```

## 📚 Architecture

### Backend Architecture (Layered)
1. **Controllers**: Handle HTTP requests/responses
2. **Services**: Business logic and game rules
3. **Repositories**: Data access layer using Prisma
4. **Models**: TypeScript interfaces and DTOs
5. **Schemas**: Validation schemas using Zod

### Frontend Architecture
1. **Pages**: Route components
2. **Components**: Reusable UI components
3. **Hooks**: Custom React hooks for state management
4. **Services**: API client and data fetching
5. **Types**: TypeScript type definitions

---

**Ready to challenge your vocabulary? Start playing now!** 🚀
