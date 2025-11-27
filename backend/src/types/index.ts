// Tipos compartidos del backend (sin Prisma)
import { Game, Guess } from '../models/game.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Re-exportar tipos del modelo
export type { Game, Guess };
