import axios from 'axios';
import {
  ApiResponse,
  Game,
  GameWithGuesses,
  CreateGameResponse,
  MakeGuessResponse,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gameApi = {
  createGame: async (gameMode?: string): Promise<Game> => {
    const response = await apiClient.post<CreateGameResponse>('/games', {
      gameMode: gameMode || 'classic',
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create game');
  },

  getGame: async (id: string): Promise<GameWithGuesses> => {
    const response = await apiClient.get<ApiResponse<GameWithGuesses>>(
      `/games/${id}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get game');
  },

  makeGuess: async (gameId: string, word: string) => {
    const response = await apiClient.post<MakeGuessResponse>(
      `/games/${gameId}/guess`,
      {
        word,
      }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to make guess');
  },

  validateWord: async (word: string, gameMode: string = 'classic'): Promise<boolean> => {
    const response = await apiClient.get<ApiResponse<{ isValid: boolean }>>(
      `/words/validate/${word}?gameMode=${gameMode}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data.isValid;
    }
    return false;
  },

  getAllWords: async (gameMode: string = 'classic'): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<{ words: string[] }>>(
      `/words/all?gameMode=${gameMode}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data.words;
    }
    throw new Error(response.data.error || 'Failed to get words');
  },
};

export const authApi = {
  syncUser: async (userId: string, email: string, username?: string) => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/sync', {
      userId,
      email,
      username,
    });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to sync user');
  },
};

export const statsApi = {
  getStats: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/stats/${userId}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to get stats');
  },

  updateStats: async (userId: string, won: boolean, attemptsUsed: number, mode: string = 'classic') => {
    const response = await apiClient.post<ApiResponse<any>>(`/stats/${userId}`, {
      won,
      attemptsUsed,
      mode,
    });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to update stats');
  },

  getHistory: async (userId: string, limit: number = 100) => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/history/${userId}?limit=${limit}`
    );
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to get history');
  },

  saveGame: async (userId: string, mode: string, targetWord: string, won: boolean, attemptsUsed: number, timeLimit?: number, timeTaken?: number) => {
    const response = await apiClient.post<ApiResponse<any>>(`/history/${userId}`, {
      mode,
      targetWord,
      won,
      attemptsUsed,
      timeLimit,
      timeTaken,
    });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to save game');
  },
};

export const dailyWordApi = {
  getAllDailyWords: async (): Promise<ApiResponse<{ words: string[] }>> => {
    const response = await apiClient.get<ApiResponse<{ words: string[] }>>('/daily/all');
    return response.data;
  },
  getTodayWord: async (word: string, userId?: string): Promise<ApiResponse<{ word: string; hasPlayed: boolean; todayGame?: { targetWord: string; won: boolean; attemptsUsed: number } }>> => {
    const params = userId ? `?userId=${userId}` : '';
    const response = await apiClient.post<ApiResponse<{ word: string; hasPlayed: boolean; todayGame?: { targetWord: string; won: boolean; attemptsUsed: number } }>>(
      `/daily/today${params}`,
      { word }
    );
    return response.data;
  },
};

export default apiClient;
