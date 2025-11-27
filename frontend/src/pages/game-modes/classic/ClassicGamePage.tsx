import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { InstructionsModal } from '../../../components/game-modes/classic/InstructionsModal';
import { GameBoard } from '../../../components/game/board/GameBoard';
import { Keyboard } from '../../../components/game/keyboard/Keyboard';
import { CellStatus } from '../../../components/game/board/GameCell';
import { useGame } from '../../../hooks/useGame';
import { gameApi } from '../../../services/api';
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
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | null>(null);
  const [validatingWord, setValidatingWord] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);

  // Crear partida al montar el componente
  useEffect(() => {
    const initGame = async () => {
      try {
        await createGame('classic');
      } catch (err) {
        console.error('Error creating game:', err);
        // Si es un error de conexión, mostrar mensaje más claro
        if (err instanceof Error && err.message.includes('Network')) {
          console.error('Backend no está disponible. Asegúrate de que el backend esté corriendo en http://localhost:3001');
        }
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
      setWordError(null);
      setCurrentGuess((prev) => {
        if (prev.length < 5) {
          return prev + key;
        }
        return prev;
      });
    },
    [gameStatus, loading, validatingWord]
  );

  const handleDelete = useCallback(() => {
    if (gameStatus !== 'playing' || loading || validatingWord) return;
    setWordError(null);
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
    setWordError(null);

    try {
      // Validar que la palabra existe en el diccionario
      const isValid = await gameApi.validateWord(currentGuess, 'classic');
      if (!isValid) {
        setWordError('La palabra no está en el diccionario');
        setValidatingWord(false);
        return;
      }

      // Hacer el intento
      const result = await makeGuess(currentGuess.toUpperCase());

      if (result) {
        // Convertir feedback a CellStatus[]
        const feedbackArray: CellStatus[] = result.feedback.map(
          (f) => f.status
        ) as CellStatus[];

        // Agregar el nuevo intento
        const newGuess: Guess = {
          word: currentGuess.toUpperCase(),
          feedback: feedbackArray,
        };

        setGuesses((prev) => {
          const newGuesses = [...prev, newGuess];
          setRevealingRow(prev.length);
          return newGuesses;
        });

        setCurrentGuess('');

        // Actualizar estado del juego
        if (result.isWon) {
          setGameStatus('won');
          // TODO: Mostrar modal de felicitaciones
        } else if (result.isGameOver) {
          setGameStatus('lost');
          // TODO: Mostrar palabra y opción de reiniciar
        }

        // Limpiar la animación después de que termine
        setTimeout(() => {
          setRevealingRow(null);
        }, 1100); // 5 casillas * 100ms delay + 600ms animación
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al procesar el intento';
      setWordError(errorMessage);
      console.error('Error making guess:', err);
    } finally {
      setValidatingWord(false);
    }
  }, [game, currentGuess, gameStatus, loading, makeGuess, validatingWord]);

  const handleRestartGame = useCallback(async () => {
    reset();
    setCurrentGuess('');
    setGuesses([]);
    setRevealingRow(null);
    setGameStatus(null);
    setWordError(null);
    try {
      await createGame('classic');
    } catch (err) {
      console.error('Error restarting game:', err);
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
      if (key.length === 1 && /[A-ZÑ]/.test(key)) {
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
      gameModeTitle="Modo Clásico"
      onHelpClick={() => setShowInstructions(true)}
      showHelpTooltip={showHelpTooltip}
    >
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 pt-12 sm:pt-0">
        {loading && !game && (
          <div className="text-center text-white">Cargando partida...</div>
        )}
        
        {error && (
          <div className="text-center text-red-500 mb-4">
            Error: {error.message}
          </div>
        )}

        {wordError && (
          <div className="text-center text-red-400 mb-4 text-sm">
            {wordError}
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
              />
            </div>

            <div className="mt-8 sm:mt-6 md:mt-8">
              <Keyboard
                onKeyPress={handleKeyPress}
                onEnter={handleEnter}
                onDelete={handleDelete}
              />
            </div>
          </>
        )}

        {gameStatus === 'won' && (
          <div className="text-center text-green-400 mt-4">
            ¡Felicidades! Has ganado 🎉
            <button
              onClick={handleRestartGame}
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Jugar de nuevo
            </button>
          </div>
        )}

        {gameStatus === 'lost' && game && (
          <div className="text-center text-red-400 mt-4">
            Se acabaron los intentos. La palabra era: <strong>{game.targetWord}</strong>
            <button
              onClick={handleRestartGame}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Jugar de nuevo
            </button>
          </div>
        )}

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
      </div>
    </Layout>
  );
};
