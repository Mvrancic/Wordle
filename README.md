# Wordle Game Unlimited 🎯

A comprehensive Wordle game implementation featuring multiple game modes, built as a full-stack monorepo with both frontend and backend components.

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

## 🏗️ Repository Structure

This is a **monorepo** containing both frontend and backend components:

- **Frontend**: Modern web interface built with cutting-edge technologies
- **Backend**: Robust API and game logic server
- **Shared**: Common utilities, types, and game logic shared between frontend and backend

## 🎯 Game Features

- **Multiple Difficulty Levels**: From beginner-friendly to expert challenges
- **Responsive Design**: Play seamlessly across desktop, tablet, and mobile devices
- **Real-time Feedback**: Instant visual feedback for each guess
- **Statistics Tracking**: Keep track of your win streaks and performance
- **Customizable Themes**: Choose from various color schemes and themes
- **Multi-language Support**: Enjoy the game in different languages

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd wordle

# Install dependencies for the entire monorepo
npm install

# Start the development environment
npm run dev
```

### Running Individual Components
```bash
# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend

# Full-stack development
npm run dev:full
```

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

## 🛠️ Technology Stack

- **Frontend**: React/Next.js with TypeScript
- **Backend**: Node.js with Express/Fastify
- **Database**: PostgreSQL/MongoDB for game statistics
- **Styling**: Tailwind CSS or Styled Components
- **Testing**: Jest, Cypress for comprehensive testing
- **Deployment**: Docker containers with CI/CD pipeline

## 📊 Game Statistics

Track your progress with detailed statistics:
- Win percentage across all game modes
- Average guesses per game
- Longest win streak
- Total games played
- Performance by game mode

---

**Ready to challenge your vocabulary? Start playing now!** 🚀
