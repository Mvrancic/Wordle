// Modelos para usuarios y estadísticas

export interface User {
  id: string;
  email: string;
  username?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  userId: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
  avgAttempts: number;
  lastPlayedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserGameHistory {
  id: string;
  userId: string;
  mode: string; // classic, hard, timed, daily, etc.
  targetWord: string;
  won: boolean;
  attemptsUsed: number;
  timeLimit?: number;
  timeTaken?: number;
  playedAt: Date;
  createdAt: Date;
}

// DTOs
export interface UpdateUserStatsDto {
  won: boolean;
  attemptsUsed: number;
}

export interface CreateGameHistoryDto {
  userId: string;
  mode: string;
  targetWord: string;
  won: boolean;
  attemptsUsed: number;
  timeLimit?: number;
  timeTaken?: number;
}


