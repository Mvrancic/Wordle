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

const STORAGE_KEY = 'wordle-game-state';
const MAX_ATTEMPTS = 6;

/**
 * Motor base del juego Wordle - reutilizable para todos los modos
 * Maneja estado, evaluación, persistencia en localStorage
 */
export function useWordleEngine() {
  const [targetWord, setTargetWord] = useState<string>('');
  const [attempts, setAttempts] = useState<GameGuess[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [currentAttempt, setCurrentAttempt] = useState(0);

  // Cargar estado guardado al inicializar
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const state: GameState = JSON.parse(savedState);
        // Solo restaurar si hay una palabra objetivo (juego en progreso)
        if (state.targetWord && state.targetWord.length === 5) {
          setTargetWord(state.targetWord);
          setAttempts(state.attempts || []);
          setGameStatus(state.gameStatus || 'playing');
          setCurrentAttempt(state.currentAttempt || 0);
        }
      } catch (error) {
        console.error('Error loading saved game state:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    if (targetWord) {
      const state: GameState = {
        targetWord,
        attempts,
        gameStatus,
        currentAttempt,
        maxAttempts: MAX_ATTEMPTS,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [targetWord, attempts, gameStatus, currentAttempt]);

  /**
   * Inicia un nuevo juego con una palabra objetivo específica
   */
  const startNewGame = useCallback((word: string) => {
    const upperWord = word.toUpperCase();
    setTargetWord(upperWord);
    setAttempts([]);
    setGameStatus('playing');
    setCurrentAttempt(0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      targetWord: upperWord,
      attempts: [],
      gameStatus: 'playing',
      currentAttempt: 0,
      maxAttempts: MAX_ATTEMPTS,
    }));
  }, []);

  /**
   * Procesa un intento: valida y evalúa la palabra
   */
  const submitGuess = useCallback((guess: string, dictionary: Set<string>): {
    feedback: CellStatus[];
    isWon: boolean;
    isGameOver: boolean;
  } | null => {
    if (!targetWord) {
      throw new Error('No game active. Call startNewGame first.');
    }

    const upperGuess = guess.toUpperCase();

    // Validar palabra
    if (!isValidWord(upperGuess, dictionary)) {
      return null; // Indica que la palabra no es válida
    }

    // Evaluar feedback
    const feedback = evaluateGuess(upperGuess, targetWord);

    // Crear nuevo intento
    const newAttempt: GameGuess = {
      word: upperGuess,
      feedback,
    };

    const newAttempts = [...attempts, newAttempt];
    const newCurrentAttempt = currentAttempt + 1;

    // Determinar si ganó o perdió
    const isWon = upperGuess === targetWord;
    const isGameOver = isWon || newCurrentAttempt >= MAX_ATTEMPTS;
    const newStatus: 'playing' | 'won' | 'lost' = isWon
      ? 'won'
      : isGameOver
        ? 'lost'
        : 'playing';

    // Actualizar estado
    setAttempts(newAttempts);
    setCurrentAttempt(newCurrentAttempt);
    setGameStatus(newStatus);

    // Limpiar localStorage si el juego terminó
    if (isGameOver) {
      localStorage.removeItem(STORAGE_KEY);
    }

    return {
      feedback,
      isWon,
      isGameOver,
    };
  }, [targetWord, attempts, currentAttempt]);

  /**
   * Resetea el juego completamente
   */
  const reset = useCallback(() => {
    setTargetWord('');
    setAttempts([]);
    setGameStatus('playing');
    setCurrentAttempt(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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

