import axios from 'axios';
import { ApiResponse, UserStats, GameHistory, SyncUserResponse } from '../types';
import { supabase } from '../config/supabase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the current Supabase session token so the backend can verify who's
// calling instead of trusting whatever userId shows up in the URL/body.
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  syncUser: async (email: string, username?: string): Promise<ApiResponse<SyncUserResponse>> => {
    const response = await apiClient.post<ApiResponse<SyncUserResponse>>('/auth/sync', {
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
  getStats: async (userId: string): Promise<ApiResponse<UserStats>> => {
    const response = await apiClient.get<ApiResponse<UserStats>>(`/stats/${userId}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to get stats');
  },

  getHistory: async (userId: string, limit: number = 100): Promise<ApiResponse<GameHistory[]>> => {
    const response = await apiClient.get<ApiResponse<GameHistory[]>>(
      `/history/${userId}?limit=${limit}`
    );
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to get history');
  },

  // Records the finished game (history) and updates the user's streak/win-rate
  // stats in a single call, for whoever the current session belongs to.
  saveGame: async (mode: string, targetWord: string, won: boolean, attemptsUsed: number, timeLimit?: number, timeTaken?: number): Promise<ApiResponse<UserStats>> => {
    const response = await apiClient.post<ApiResponse<UserStats>>('/stats/record', {
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
  getTodayWord: async (word: string): Promise<ApiResponse<{ word: string; hasPlayed: boolean; todayGame?: { targetWord: string; won: boolean; attemptsUsed: number } }>> => {
    const response = await apiClient.post<ApiResponse<{ word: string; hasPlayed: boolean; todayGame?: { targetWord: string; won: boolean; attemptsUsed: number } }>>(
      '/daily/today',
      { word }
    );
    return response.data;
  },
};

export default apiClient;
