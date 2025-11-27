import { useCallback } from 'react';
import { useWordleEngine } from './useWordleEngine';
import { useWordDictionary } from './useWordDictionary';
import { getRandomWord } from '../utils/gameLogic';

/**
 * Hook específico para el modo Classic (unlimited/random)
 * Selecciona una palabra aleatoria para cada nueva partida
 */
export function useLocalClassicGame() {
  const engine = useWordleEngine();
  const { getWordList, isReady } = useWordDictionary();

  /**
   * Inicia una nueva partida con palabra aleatoria
   */
  const startNewGame = useCallback(() => {
    const wordList = getWordList();
    if (wordList.length === 0) {
      throw new Error('Word dictionary not loaded yet');
    }
    const randomWord = getRandomWord(wordList);
    engine.startNewGame(randomWord);
  }, [engine, getWordList]);

  return {
    targetWord: engine.targetWord,
    attempts: engine.attempts,
    gameStatus: engine.gameStatus,
    currentAttempt: engine.currentAttempt,
    maxAttempts: engine.maxAttempts,
    isReady,
    startNewGame,
    submitGuess: engine.submitGuess,
    reset: engine.reset,
  };
}

