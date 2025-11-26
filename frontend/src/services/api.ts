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
};

export default apiClient;
