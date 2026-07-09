import { useCallback, useState } from 'react';
import { useWordDictionary } from './useWordDictionary';
import { MultiBoardState, pickUniqueRandomWords, submitMultiGuess } from '../utils/gameLogic';

export type BoardCount = 2 | 4;

/**
 * Quordle/Dordle-style multi-board mode: boardCount unique target words,
 * one guess evaluated against every unsolved board at once, boardCount + 5
 * shared attempts total (the standard convention: 7 for 2 boards, 9 for 4).
 */
export function useLocalMultiGame(boardCount: BoardCount) {
  const { getWordList, isReady } = useWordDictionary();

  const [boards, setBoards] = useState<MultiBoardState[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const maxAttempts = boardCount + 5;

  const startNewGame = useCallback(() => {
    const wordList = getWordList();
    if (wordList.length < boardCount) {
      throw new Error('Word dictionary not loaded yet');
    }

    const words = pickUniqueRandomWords(wordList, boardCount);
    setBoards(words.map((targetWord) => ({ targetWord, attempts: [], solved: false })));
    setCurrentAttempt(0);
    setGameStatus('playing');
  }, [getWordList, boardCount]);

  const submitGuess = useCallback(
    (guess: string): { boards: MultiBoardState[]; isWon: boolean; isGameOver: boolean } | null => {
      if (gameStatus !== 'playing' || boards.length === 0) {
        return null;
      }

      const nextBoards = submitMultiGuess(boards, guess);
      const nextAttempt = currentAttempt + 1;
      const isWon = nextBoards.every((board) => board.solved);
      const isGameOver = isWon || nextAttempt >= maxAttempts;

      setBoards(nextBoards);
      setCurrentAttempt(nextAttempt);
      setGameStatus(isWon ? 'won' : isGameOver ? 'lost' : 'playing');

      return { boards: nextBoards, isWon, isGameOver };
    },
    [boards, currentAttempt, gameStatus, maxAttempts]
  );

  const reset = useCallback(() => {
    setBoards([]);
    setCurrentAttempt(0);
    setGameStatus('playing');
  }, []);

  return {
    boards,
    currentAttempt,
    maxAttempts,
    gameStatus,
    isReady,
    startNewGame,
    submitGuess,
    reset,
  };
}
