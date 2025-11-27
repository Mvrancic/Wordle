import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gameApi } from '../services/api';
import { GameWithGuesses } from '../types';

export function useGameQuery(gameId?: string) {
  const queryClient = useQueryClient();

  // Query para obtener un juego existente
  const gameQuery = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gameApi.getGame(gameId!),
    enabled: !!gameId,
    staleTime: 1000 * 30, // 30 segundos
  });

  // Mutation para crear un nuevo juego
  const createGameMutation = useMutation({
    mutationFn: (gameMode?: string) => gameApi.createGame(gameMode),
    onSuccess: (data) => {
      // Actualizar caché con el nuevo juego
      queryClient.setQueryData(['game', data.id], {
        ...data,
        guesses: [],
      });
    },
  });

  // Mutation para hacer un intento
  const makeGuessMutation = useMutation({
    mutationFn: ({ gameId, word }: { gameId: string; word: string }) =>
      gameApi.makeGuess(gameId, word),
    onSuccess: async (result, variables) => {
      // Actualizar caché con el juego actualizado
      const updatedGame = await gameApi.getGame(variables.gameId);
      queryClient.setQueryData(['game', variables.gameId], updatedGame);
      return result;
    },
  });

  return {
    game: gameQuery.data,
    loading: gameQuery.isLoading || createGameMutation.isPending || makeGuessMutation.isPending,
    error: gameQuery.error || createGameMutation.error || makeGuessMutation.error,
    createGame: createGameMutation.mutateAsync,
    makeGuess: (word: string) => {
      if (!gameId && !gameQuery.data?.id) {
        throw new Error('No game active');
      }
      return makeGuessMutation.mutateAsync({
        gameId: gameId || gameQuery.data!.id,
        word,
      });
    },
    refetch: gameQuery.refetch,
  };
}

