import { useState, useCallback } from 'react';
import { gameApi } from '../services/api';
import { GameWithGuesses } from '../types';

export function useGame() {
  const [game, setGame] = useState<GameWithGuesses | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createGame = useCallback(async (gameMode?: string, retries = 2) => {
    setLoading(true);
    setError(null);
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const newGame = await gameApi.createGame(gameMode);
        const gameWithGuesses: GameWithGuesses = {
          ...newGame,
          guesses: [],
        };
        setGame(gameWithGuesses);
        setLoading(false);
        return gameWithGuesses;
      } catch (err) {
        const isLastAttempt = attempt === retries;
        const isServerError = err instanceof Error && (
          err.message.includes('500') || 
          err.message.includes('Failed') ||
          err.message.includes('Network')
        );
        
        if (isLastAttempt || !isServerError) {
          const error =
            err instanceof Error ? err : new Error('Failed to create game');
          setError(error);
          setLoading(false);
          throw error;
        }
        
        // Esperar antes de reintentar (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }, []);

  const fetchGame = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedGame = await gameApi.getGame(id);
      setGame(fetchedGame);
      return fetchedGame;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to fetch game');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const makeGuess = useCallback(
    async (word: string) => {
      if (!game) throw new Error('No game active');

      setLoading(true);
      setError(null);
      try {
        const result = await gameApi.makeGuess(game.id, word);
        const updatedGame = await gameApi.getGame(game.id);
        setGame(updatedGame);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to make guess');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [game]
  );

  const reset = useCallback(() => {
    setGame(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    game,
    loading,
    error,
    createGame,
    fetchGame,
    makeGuess,
    reset,
  };
}
