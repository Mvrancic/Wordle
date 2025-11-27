import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { InstructionsModal } from '../../../components/game-modes/classic/InstructionsModal';
import { GameBoard } from '../../../components/game/board/GameBoard';
import { Keyboard } from '../../../components/game/keyboard/Keyboard';
import { CellStatus } from '../../../components/game/board/GameCell';
import { Toast } from '../../../components/ui/Toast';
import { GameOverModal } from '../../../components/game-modes/classic/GameOverModal';
import { useGame } from '../../../hooks/useGame';
import { useKeyboardColors } from '../../../hooks/useKeyboardColors';
import { useWordDictionary } from '../../../hooks/useWordDictionary';
import { GuessFeedback } from '../../../types';

interface Guess {
  word: string;
  feedback: CellStatus[];
}

export const ClassicGamePage: React.FC = () => {
  const { game, loading, error, createGame, makeGuess, reset } = useGame();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | null>(null);
  const [validatingWord, setValidatingWord] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  
  // Hook para colores del teclado
  const keyColors = useKeyboardColors(guesses);
  
  // Hook para diccionario local (validación instantánea)
  const { isReady: dictionaryReady, validateWord: validateWordLocal } = useWordDictionary();

  // Crear partida al montar el componente
  useEffect(() => {
    const initGame = async () => {
      try {
        await createGame('classic');
      } catch (err) {
        console.error('Error creating game:', err);
        const errorMessage =
          err instanceof Error && err.message.includes('Network')
            ? 'Connection error. Make sure the backend is running.'
            : err instanceof Error && err.message.includes('500')
              ? 'Server error. Please try again in a moment.'
              : 'Error creating game. Please try again.';
        setToast({ message: errorMessage, type: 'error' });
      }
    };
    initGame();

    // Mostrar tooltip al entrar a la página
    const hasSeenTooltip = sessionStorage.getItem('wordle-help-tooltip-seen');
    if (!hasSeenTooltip) {
      setShowHelpTooltip(true);
      const timer = setTimeout(() => {
        setShowHelpTooltip(false);
        sessionStorage.setItem('wordle-help-tooltip-seen', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [createGame]);

  // Actualizar guesses cuando cambia el juego
  useEffect(() => {
    if (game) {
      setGameStatus(game.status);
      const parsedGuesses: Guess[] = game.guesses.map((guess) => {
        try {
          const feedback: GuessFeedback[] = JSON.parse(guess.feedback);
          return {
            word: guess.word,
            feedback: feedback.map((f) => f.status) as CellStatus[],
          };
        } catch {
          return {
            word: guess.word,
            feedback: Array(5).fill('absent') as CellStatus[],
          };
        }
      });
      setGuesses(parsedGuesses);
    }
  }, [game]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== 'playing' || loading || validatingWord) return;
      setCurrentGuess((prev) => {
        if (prev.length < 5) {
          return prev + key;
        }
        return prev;
      });
    },
    [gameStatus, loading, validatingWord, dictionaryReady]
  );

  const handleDelete = useCallback(() => {
    if (gameStatus !== 'playing' || loading || validatingWord) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameStatus, loading, validatingWord]);

  const handleEnter = useCallback(async () => {
    if (
      gameStatus !== 'playing' ||
      !game ||
      currentGuess.length !== 5 ||
      loading ||
      validatingWord
    ) {
      return;
    }

    setValidatingWord(true);
    setShakingRow(null);

    try {
      // Validar localmente (instantáneo) si el diccionario está listo
      const guessWord = currentGuess.toUpperCase();
      
      if (dictionaryReady) {
        const isValid = validateWordLocal(guessWord);
        if (!isValid) {
          // Animación shake en la fila actual
          const currentRowIndex = guesses.length;
          setShakingRow(currentRowIndex);
          setToast({ message: 'Invalid word', type: 'error' });
          
          // Limpiar shake después de la animación
          setTimeout(() => {
            setShakingRow(null);
          }, 500);
          
          setValidatingWord(false);
          return;
        }
      }
      // Si el diccionario no está listo, el backend validará (fallback)

      // Hacer el intento PRIMERO para obtener el feedback antes de animar
      const rowIndex = guesses.length;
      
      // Obtener feedback ANTES de iniciar animación
      const result = await makeGuess(guessWord);

      if (result) {
        // Convertir feedback a CellStatus[]
        const feedbackArray: CellStatus[] = result.feedback.map(
          (f) => f.status
        ) as CellStatus[];

        // Agregar el guess con feedback real ANTES de animar
        const newGuess: Guess = {
          word: guessWord,
          feedback: feedbackArray,
        };

        setGuesses(prev => [...prev, newGuess]);
        setCurrentGuess('');

        // AHORA iniciar la animación (el feedback ya está disponible, se revelará durante el flip)
        setRevealingRow(rowIndex);

        // Actualizar estado del juego
        if (result.isWon) {
          setGameStatus('won');
        } else if (result.isGameOver) {
          setGameStatus('lost');
        }

        // Limpiar la animación después de que termine
        setTimeout(() => {
          setRevealingRow(null);
        }, 1200 + (5 * 150)); // Duración de animación (1.2s) + delays entre casillas (5 * 150ms)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error processing attempt';
      
      // Si es error 500, mostrar toast y ocultar después de 3 segundos
      if (errorMessage.includes('500') || errorMessage.includes('Failed')) {
        setToast({ message: 'Server error. Please try again.', type: 'error' });
      } else {
        setToast({ message: errorMessage, type: 'error' });
      }
      
      console.error('Error making guess:', err);
    } finally {
      setValidatingWord(false);
    }
  }, [game, currentGuess, gameStatus, loading, makeGuess, validatingWord, guesses]);

  const handleRestartGame = useCallback(async () => {
    reset();
    setCurrentGuess('');
    setGuesses([]);
    setRevealingRow(null);
    setShakingRow(null);
    setGameStatus(null);
    setToast(null);
    try {
      await createGame('classic');
    } catch (err) {
      console.error('Error restarting game:', err);
      setToast({ message: 'Error restarting game. Please try again.', type: 'error' });
    }
  }, [createGame, reset]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const handleKeyboardPress = (e: KeyboardEvent) => {
      // Detectar Ctrl+R o Cmd+R para reiniciar el juego
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRestartGame();
        return;
      }

      // Ignorar otras combinaciones de teclas con Ctrl/Cmd/Alt
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
  }, [gameStatus, handleKeyPress, handleDelete, handleEnter, handleRestartGame]);

  const gameStarted = game !== null && gameStatus === 'playing';

  return (
    <Layout
      gameModeTitle="Classic Mode"
      onHelpClick={() => setShowInstructions(true)}
      showHelpTooltip={showHelpTooltip}
    >
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 pt-12 sm:pt-0">
        <Toast
          message={toast?.message || ''}
          type={toast?.type || 'error'}
          isVisible={toast !== null}
          onClose={() => setToast(null)}
        />

        {loading && !game && (
          <div className="text-center text-white">Loading game...</div>
        )}
        
        {error && !toast && (
          <div className="text-center text-red-500 mb-4">
            Error: {error.message}
          </div>
        )}

        {gameStarted && (
          <>
            <div className="mb-12 sm:mb-12 md:mb-16">
              <GameBoard
                guesses={guesses}
                currentGuess={currentGuess}
                maxAttempts={6}
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
          isOpen={gameStatus === 'won' || gameStatus === 'lost'}
          isWon={gameStatus === 'won'}
          targetWord={game?.targetWord || ''}
          attempts={guesses.length}
          onPlayAgain={handleRestartGame}
        />

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
      </div>
    </Layout>
  );
};
