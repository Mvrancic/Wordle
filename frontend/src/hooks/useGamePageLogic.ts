import { useState, useEffect, useCallback, useRef } from 'react';
import { CellStatus } from '../components/game/board/GameCell';
import { useKeyboardColors } from './useKeyboardColors';
import { useWordDictionary } from './useWordDictionary';
import { useAuth } from '../contexts/AuthContext';
import { statsApi } from '../services/api';

interface Guess {
  word: string;
  feedback: CellStatus[];
}

interface UseGamePageLogicOptions {
  targetWord: string | null;
  attempts: Guess[];
  gameStatus: 'playing' | 'won' | 'lost';
  maxAttempts: number;
  isReady: boolean;
  startNewGame?: () => void;
  submitGuess: (word: string, dictionary: Set<string>) => {
    feedback: CellStatus[];
    isWon: boolean;
    isGameOver: boolean;
  } | null;
  reset?: () => void;
  gameMode: 'classic' | 'hard' | 'daily' | 'timer';
  validateGuess?: (guess: string, attempts: Guess[]) => { isValid: boolean; errorMessage?: string };
  tooltipKey?: string;
  onGameStartError?: (error: Error) => void;
}

const ANIMATION_DURATION = 1200;
const LAST_CELL_DELAY = 4 * 200;
const TOTAL_ANIMATION_DURATION = LAST_CELL_DELAY + ANIMATION_DURATION;

export function useGamePageLogic({
  targetWord,
  attempts,
  gameStatus,
  maxAttempts: _maxAttempts,
  isReady: gameReady,
  startNewGame,
  submitGuess,
  reset,
  gameMode,
  validateGuess,
  tooltipKey = 'wordle-help-tooltip-seen',
  onGameStartError,
}: UseGamePageLogicOptions) {
  const { user } = useAuth();
  const { isReady: dictionaryReady, validateWord: validateWordLocal, getDictionary } = useWordDictionary();
  const gameSavedRef = useRef(false);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [keyboardReadyRow, setKeyboardReadyRow] = useState<number | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  useEffect(() => {
    if (gameStatus === 'playing') {
      setShowGameOver(false);
      setModalDismissed(false);
    }
  }, [gameStatus]);

  const guessesForKeyboard = revealingRow !== null && (keyboardReadyRow === null || keyboardReadyRow < revealingRow)
    ? attempts.slice(0, revealingRow)
    : keyboardReadyRow !== null
      ? attempts.slice(0, keyboardReadyRow + 1)
      : attempts;

  const keyColors = useKeyboardColors(guessesForKeyboard);
  const guesses: Guess[] = attempts;

  useEffect(() => {
    if (dictionaryReady && gameReady && !targetWord && startNewGame) {
      try {
        startNewGame();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        if (onGameStartError) {
          onGameStartError(error);
        }
        setToast({ message: 'Error starting game. Please refresh the page.', type: 'error' });
      }
    }

    const hasSeenTooltip = sessionStorage.getItem(tooltipKey);
    if (!hasSeenTooltip) {
      setShowHelpTooltip(true);
      const timer = setTimeout(() => {
        setShowHelpTooltip(false);
        sessionStorage.setItem(tooltipKey, 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dictionaryReady, gameReady, targetWord, startNewGame, tooltipKey, onGameStartError]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== 'playing') return;
      setCurrentGuess((prev) => (prev.length < 5 ? prev + key : prev));
    },
    [gameStatus]
  );

  const handleDelete = useCallback(() => {
    if (gameStatus !== 'playing') return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameStatus]);

  const handleEnter = useCallback(() => {
    if (gameStatus !== 'playing' || !targetWord || currentGuess.length !== 5 || !dictionaryReady) {
      return;
    }

    setShakingRow(null);
    const guessWord = currentGuess.toUpperCase();
    const dictionary = getDictionary();

    if (!dictionary) {
      setToast({ message: 'Dictionary not loaded. Please wait.', type: 'error' });
      return;
    }

    if (!validateWordLocal(guessWord)) {
      const currentRowIndex = attempts.length;
      setShakingRow(currentRowIndex);
      setToast({ message: 'Invalid word', type: 'error' });
      setTimeout(() => setShakingRow(null), 500);
      return;
    }

    if (validateGuess && attempts.length > 0) {
      const validation = validateGuess(guessWord, attempts);
      if (!validation.isValid) {
        const currentRowIndex = attempts.length;
        setShakingRow(currentRowIndex);
        setToast({ message: validation.errorMessage || 'Invalid guess', type: 'error' });
        setTimeout(() => setShakingRow(null), 500);
        return;
      }
    }

    const rowIndex = attempts.length;
    const result = submitGuess(guessWord, dictionary);

    if (result) {
      if (keyboardReadyRow !== null && keyboardReadyRow >= rowIndex) {
        setKeyboardReadyRow(rowIndex - 1);
      }

      setRevealingRow(rowIndex);
      setCurrentGuess('');

      setTimeout(() => {
        setKeyboardReadyRow(rowIndex);
      }, TOTAL_ANIMATION_DURATION);

      setTimeout(() => {
        setRevealingRow(null);
      }, TOTAL_ANIMATION_DURATION + 50);
    }
  }, [
    targetWord,
    currentGuess,
    gameStatus,
    dictionaryReady,
    attempts,
    validateWordLocal,
    getDictionary,
    submitGuess,
    keyboardReadyRow,
    validateGuess,
  ]);

  const handleRestartGame = useCallback(() => {
    if (reset) {
      reset();
    }
    setCurrentGuess('');
    setRevealingRow(null);
    setShakingRow(null);
    setKeyboardReadyRow(null);
    setToast(null);
    setShowGameOver(false);
    gameSavedRef.current = false;

    if (dictionaryReady && startNewGame) {
      try {
        startNewGame();
      } catch (err) {
        setToast({ message: 'Error restarting game. Please try again.', type: 'error' });
      }
    }
  }, [reset, startNewGame, dictionaryReady]);

  useEffect(() => {
    if (!user || !targetWord || gameStatus === 'playing' || gameSavedRef.current) {
      return;
    }

    const saveGameStats = async () => {
      try {
        await statsApi.saveGame(user.id, gameMode, targetWord, gameStatus === 'won', attempts.length);
        gameSavedRef.current = true;
      } catch (error) {
        // Silently fail - stats are not critical
      }
    };

    saveGameStats();
  }, [user, targetWord, gameStatus, attempts.length, gameMode]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const handleKeyboardPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r' && reset) {
        e.preventDefault();
        handleRestartGame();
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key.length === 1 && /[A-Z]/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        e.preventDefault();
        handleDelete();
      } else if (key === 'ENTER') {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyboardPress);
    return () => window.removeEventListener('keydown', handleKeyboardPress);
  }, [gameStatus, handleKeyPress, handleDelete, handleEnter, handleRestartGame, reset]);

  useEffect(() => {
    if ((gameStatus === 'won' || gameStatus === 'lost') && !modalDismissed) {
      setShowGameOver(true);
    } else if (gameStatus === 'playing') {
      setShowGameOver(false);
      setModalDismissed(false);
    }
  }, [gameStatus, modalDismissed]);

  const handleCloseModal = useCallback(() => {
    setShowGameOver(false);
    setModalDismissed(true);
  }, []);

  return {
    showInstructions,
    setShowInstructions,
    showHelpTooltip,
    currentGuess,
    revealingRow,
    shakingRow,
    toast,
    setToast,
    showGameOver,
    setShowGameOver: handleCloseModal,
    guesses,
    keyColors,
    dictionaryReady,
    gameReady,
    handleKeyPress,
    handleDelete,
    handleEnter,
    handleRestartGame,
  };
}

