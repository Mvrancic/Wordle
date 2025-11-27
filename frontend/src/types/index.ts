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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
