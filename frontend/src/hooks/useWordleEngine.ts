import { useState, useEffect, useCallback } from 'react';
import { CellStatus } from '../components/game/board/GameCell';
import { evaluateGuess, isValidWord } from '../utils/gameLogic';

interface GameGuess {
  word: string;
  feedback: CellStatus[];
}

interface GameState {
  targetWord: string;
  attempts: GameGuess[];
  gameStatus: 'playing' | 'won' | 'lost';
  currentAttempt: number;
  maxAttempts: number;
}

const DEFAULT_STORAGE_KEY = 'wordle-game-state';
const MAX_ATTEMPTS = 6;

export function useWordleEngine(storageKey: string = DEFAULT_STORAGE_KEY) {
  const [targetWord, setTargetWord] = useState<string>('');
  const [attempts, setAttempts] = useState<GameGuess[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [currentAttempt, setCurrentAttempt] = useState(0);

  useEffect(() => {
    if (storageKey === 'wordle-daily-game-state') {
      return;
    }
    
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const state: GameState = JSON.parse(savedState);
        if (state.targetWord && state.targetWord.length === 5) {
          setTargetWord(state.targetWord);
          setAttempts(state.attempts || []);
          setGameStatus(state.gameStatus || 'playing');
          setCurrentAttempt(state.currentAttempt || 0);
        }
      } catch (error) {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (targetWord) {
      const state: GameState = {
        targetWord,
        attempts,
        gameStatus,
        currentAttempt,
        maxAttempts: MAX_ATTEMPTS,
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [targetWord, attempts, gameStatus, currentAttempt, storageKey]);

  const startNewGame = useCallback((word: string) => {
    const upperWord = word.toUpperCase();
    setTargetWord(upperWord);
    setAttempts([]);
    setGameStatus('playing');
    setCurrentAttempt(0);
    localStorage.setItem(storageKey, JSON.stringify({
      targetWord: upperWord,
      attempts: [],
      gameStatus: 'playing',
      currentAttempt: 0,
      maxAttempts: MAX_ATTEMPTS,
    }));
  }, [storageKey]);

  const submitGuess = useCallback((guess: string, dictionary: Set<string>): {
    feedback: CellStatus[];
    isWon: boolean;
    isGameOver: boolean;
  } | null => {
    if (!targetWord) {
      throw new Error('No game active. Call startNewGame first.');
    }

    const upperGuess = guess.toUpperCase();

    if (!isValidWord(upperGuess, dictionary)) {
      return null;
    }

    const feedback = evaluateGuess(upperGuess, targetWord);

    const newAttempt: GameGuess = {
      word: upperGuess,
      feedback,
    };

    const newAttempts = [...attempts, newAttempt];
    const newCurrentAttempt = currentAttempt + 1;

    const isWon = upperGuess === targetWord;
    const isGameOver = isWon || newCurrentAttempt >= MAX_ATTEMPTS;
    const newStatus: 'playing' | 'won' | 'lost' = isWon
      ? 'won'
      : isGameOver
        ? 'lost'
        : 'playing';

    setAttempts(newAttempts);
    setCurrentAttempt(newCurrentAttempt);
    setGameStatus(newStatus);

    if (isGameOver) {
      localStorage.removeItem(storageKey);
    }

    return {
      feedback,
      isWon,
      isGameOver,
    };
  }, [targetWord, attempts, currentAttempt, storageKey]);

  const reset = useCallback(() => {
    setTargetWord('');
    setAttempts([]);
    setGameStatus('playing');
    setCurrentAttempt(0);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    targetWord,
    attempts,
    gameStatus,
    currentAttempt,
    maxAttempts: MAX_ATTEMPTS,
    startNewGame,
    submitGuess,
    reset,
  };
}

