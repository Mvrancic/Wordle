export interface Game {
  id: string;
  userId?: string;
  gameModeId: string;
  targetWord: string;
  status: 'playing' | 'won' | 'lost';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
  gameMode?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface Guess {
  id: string;
  gameId: string;
  word: string;
  feedback: string; // JSON string with GuessFeedback[]
  attemptNumber: number;
  createdAt: string;
}

export interface GameWithGuesses extends Game {
  guesses: Guess[];
}

export interface GuessFeedback {
  letter: string;
  position: number;
  status: 'correct' | 'present' | 'absent';
}

export interface CreateGameResponse {
  success: boolean;
  data?: Game;
  error?: string;
  message?: string;
}

export interface MakeGuessResponse {
  success: boolean;
  data?: {
    game: Game;
    feedback: GuessFeedback[];
    isWon: boolean;
    isGameOver: boolean;
  };
  error?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
  avgAttempts: number;
}

export interface GameHistory {
  id: string;
  userId: string;
  mode: string;
  targetWord: string;
  won: boolean;
  attemptsUsed: number;
  timeLimit?: number;
  timeTaken?: number;
  playedAt: string;
  createdAt: string;
}

export interface SyncUserResponse {
  id: string;
  email: string;
  username?: string;
}
