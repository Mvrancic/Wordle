// Modelos TypeScript para el juego (sin Prisma)

export interface User {
  id: string;
  email: string;
  username?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameMode {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameModeWord {
  id: string;
  gameModeId: string;
  word: string;
  length: number;
  language: string;
  createdAt: Date;
}

export interface Game {
  id: string;
  userId?: string;
  gameModeId: string;
  targetWord: string;
  status: 'playing' | 'won' | 'lost';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guess {
  id: string;
  gameId: string;
  word: string;
  feedback: string; // JSON string
  attemptNumber: number;
  createdAt: Date;
}

export interface GameWithGuesses extends Game {
  guesses: Guess[];
  gameMode: GameMode;
}

export interface CreateGameDto {
  userId?: string;
  gameMode?: string;
  maxAttempts?: number;
}

export interface UpdateGameDto {
  status?: 'playing' | 'won' | 'lost';
  attempts?: number;
}

export interface GuessFeedback {
  letter: string;
  position: number;
  status: 'correct' | 'present' | 'absent';
}
