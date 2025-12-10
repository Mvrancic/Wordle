import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { InstructionsModal } from '../../../components/game-modes/classic/InstructionsModal';
import { GameBoard } from '../../../components/game/board/GameBoard';
import { Keyboard } from '../../../components/game/keyboard/Keyboard';
import { CellStatus } from '../../../components/game/board/GameCell';
import { Toast } from '../../../components/ui/Toast';
import { GameOverModal } from '../../../components/game-modes/classic/GameOverModal';
import { useDailyGame } from '../../../hooks/useDailyGame';
import { useKeyboardColors } from '../../../hooks/useKeyboardColors';
import { useWordDictionary } from '../../../hooks/useWordDictionary';
import { useAuth } from '../../../contexts/AuthContext';
import { statsApi } from '../../../services/api';

interface Guess {
  word: string;
  feedback: CellStatus[];
}

export const DailyGamePage: React.FC = () => {
  const { user } = useAuth();
  const {
    targetWord,
    attempts,
    gameStatus,
    maxAttempts,
    isReady: gameReady,
    hasPlayedToday,
    previousGame,
    isLoading,
    error,
    submitGuess,
  } = useDailyGame();

  const { isReady: dictionaryReady, validateWord: validateWordLocal, getDictionary } = useWordDictionary();
  const gameSavedRef = useRef(false);

  // Limpiar cualquier estado de otros modos al montar
  useEffect(() => {
    // Limpiar localStorage de otros modos para asegurar que Daily sea independiente
    localStorage.removeItem('wordle-game-state');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showInstructions, setShowInstructions] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [keyboardReadyRow, setKeyboardReadyRow] = useState<number | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  const guessesForKeyboard = revealingRow !== null && (keyboardReadyRow === null || keyboardReadyRow < revealingRow)
    ? attempts.slice(0, revealingRow)
    : keyboardReadyRow !== null
      ? attempts.slice(0, keyboardReadyRow + 1)
      : attempts;

  const keyColors = useKeyboardColors(guessesForKeyboard);
  const guesses: Guess[] = attempts;

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== 'playing' || hasPlayedToday) return;
      setCurrentGuess((prev) => {
        if (prev.length < 5) {
          return prev + key;
        }
        return prev;
      });
    },
    [gameStatus, hasPlayedToday]
  );

  const handleDelete = useCallback(() => {
    if (gameStatus !== 'playing' || hasPlayedToday) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameStatus, hasPlayedToday]);

  const handleEnter = useCallback(() => {
    if (
      gameStatus !== 'playing' ||
      hasPlayedToday ||
      !targetWord ||
      currentGuess.length !== 5 ||
      !dictionaryReady
    ) {
      return;
    }

    setShakingRow(null);

    const guessWord = currentGuess.toUpperCase();
    const dictionary = getDictionary();

    if (!dictionary) {
      setToast({ message: 'Dictionary not loaded. Please wait.', type: 'error' });
      return;
    }

    const isValid = validateWordLocal(guessWord);
    if (!isValid) {
      const currentRowIndex = attempts.length;
      setShakingRow(currentRowIndex);
      setToast({ message: 'Invalid word', type: 'error' });

      setTimeout(() => {
        setShakingRow(null);
      }, 500);
      return;
    }

    const rowIndex = attempts.length;
    const result = submitGuess(guessWord, dictionary);

    if (result) {
      if (keyboardReadyRow !== null && keyboardReadyRow >= rowIndex) {
        setKeyboardReadyRow(rowIndex - 1);
      }

      setRevealingRow(rowIndex);
      setCurrentGuess('');

      const animationDuration = 1200;
      const lastCellDelay = 4 * 200;
      const totalDuration = lastCellDelay + animationDuration;

      setTimeout(() => {
        setKeyboardReadyRow(rowIndex);
      }, totalDuration);

      setTimeout(() => {
        setRevealingRow(null);
      }, totalDuration + 50);
    }
  }, [targetWord, currentGuess, gameStatus, hasPlayedToday, dictionaryReady, attempts.length, validateWordLocal, getDictionary, submitGuess, keyboardReadyRow]);

  // Save game stats when game ends
  useEffect(() => {
    const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

    if (!user || !targetWord || gameStatus === 'playing' || !isGameOver || gameSavedRef.current) {
      return;
    }

    const saveGameStats = async () => {
      try {
        const won = gameStatus === 'won';
        const attemptsUsed = attempts.length;

        await statsApi.saveGame(
          user.id,
          'daily',
          targetWord,
          won,
          attemptsUsed
        );

        gameSavedRef.current = true;
      } catch (error) {
        // Error saving game stats
      }
    };

    saveGameStats();
  }, [user, targetWord, gameStatus, attempts.length]);

  useEffect(() => {
    if (gameStatus !== 'playing' || hasPlayedToday) return;

    const handleKeyboardPress = (e: KeyboardEvent) => {
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
  }, [gameStatus, hasPlayedToday, handleKeyPress, handleDelete, handleEnter]);

  // Show game over modal when game ends OR when user already played today
  React.useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      setShowGameOver(true);
    } else if (hasPlayedToday && previousGame && targetWord) {
      // Si ya jugó hoy, mostrar el modal automáticamente
      setShowGameOver(true);
    }
  }, [gameStatus, hasPlayedToday, previousGame, targetWord]);

  return (
    <Layout
      gameModeTitle="Daily Word"
      onHelpClick={() => setShowInstructions(true)}
    >
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 pt-12 sm:pt-0">
        <Toast
          message={toast?.message || ''}
          type={toast?.type || 'error'}
          isVisible={toast !== null}
          onClose={() => setToast(null)}
        />


        {(!dictionaryReady || !gameReady || isLoading) && (
          <div className="text-center text-white">Loading...</div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-600/20 border border-red-600 rounded-lg text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {targetWord && gameStatus && (
          <>
            <div className="mb-12 sm:mb-12 md:mb-16">
              <GameBoard
                guesses={guesses}
                currentGuess={currentGuess}
                maxAttempts={maxAttempts}
                revealingRow={revealingRow}
                shakingRow={shakingRow}
              />
            </div>

            <div className="mt-8 sm:mt-6 md:mt-8">
              <Keyboard
                onKeyPress={handleKeyPress}
                onEnter={handleEnter}
                onDelete={handleDelete}
                keyColors={keyColors}
              />
            </div>
          </>
        )}

        <GameOverModal
          isOpen={showGameOver && ((gameStatus === 'won' || gameStatus === 'lost') || (hasPlayedToday && !!previousGame))}
          isWon={previousGame ? previousGame.won : gameStatus === 'won'}
          targetWord={targetWord || ''}
          attempts={previousGame ? previousGame.attemptsUsed : attempts.length}
          onClose={() => {
            // Solo permitir cerrar si no ha jugado hoy
            if (!hasPlayedToday || !previousGame) {
              setShowGameOver(false);
            }
          }}
          isDailyMode={true}
          preventClose={hasPlayedToday && !!previousGame} // Prevenir cerrar si ya jugó hoy
        />

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          gameMode="classic"
        />
      </div>
    </Layout>
  );
};

