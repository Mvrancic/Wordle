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
