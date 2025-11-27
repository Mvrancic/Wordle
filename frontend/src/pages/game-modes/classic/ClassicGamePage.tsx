import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { InstructionsModal } from '../../../components/game-modes/classic/InstructionsModal';
import { GameBoard } from '../../../components/game/board/GameBoard';
import { Keyboard } from '../../../components/game/keyboard/Keyboard';
import { CellStatus } from '../../../components/game/board/GameCell';
import { Toast } from '../../../components/ui/Toast';
import { GameOverModal } from '../../../components/game-modes/classic/GameOverModal';
import { useLocalClassicGame } from '../../../hooks/useLocalClassicGame';
import { useKeyboardColors } from '../../../hooks/useKeyboardColors';
import { useWordDictionary } from '../../../hooks/useWordDictionary';

interface Guess {
  word: string;
  feedback: CellStatus[];
}

export const ClassicGamePage: React.FC = () => {
  const {
    targetWord,
    attempts,
    gameStatus,
    maxAttempts,
    isReady: gameReady,
    startNewGame,
    submitGuess,
    reset,
  } = useLocalClassicGame();
  
  const { isReady: dictionaryReady, validateWord: validateWordLocal, getDictionary } = useWordDictionary();
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [keyboardReadyRow, setKeyboardReadyRow] = useState<number | null>(null);
  
  // Usar todos los guesses, incluyendo el que acaba de terminar su animación
  // keyboardReadyRow indica que esa fila ya terminó de animarse y puede incluirse en los colores
  // Si hay una fila siendo animada (revealingRow) y aún no está lista (keyboardReadyRow), excluirla
  const guessesForKeyboard = revealingRow !== null && (keyboardReadyRow === null || keyboardReadyRow < revealingRow)
    ? attempts.slice(0, revealingRow) // Excluir la fila que está siendo animada
    : keyboardReadyRow !== null
      ? attempts.slice(0, keyboardReadyRow + 1) // Incluir hasta la fila que terminó
      : attempts; // Si no hay animación, incluir todos
  
  // Hook para colores del teclado
  const keyColors = useKeyboardColors(guessesForKeyboard);
  
  // Convertir attempts a formato Guess para compatibilidad
  const guesses: Guess[] = attempts;

  // Inicializar juego cuando el diccionario esté listo
  useEffect(() => {
    // Si el diccionario está listo y no hay juego activo, iniciar uno nuevo
    if (dictionaryReady && gameReady && !targetWord) {
      try {
        startNewGame();
      } catch (err) {
        console.error('Error starting game:', err);
        setToast({ message: 'Error starting game. Please refresh the page.', type: 'error' });
      }
    }

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
  }, [dictionaryReady, gameReady, targetWord, startNewGame]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== 'playing') return;
      setCurrentGuess((prev) => {
        if (prev.length < 5) {
          return prev + key;
        }
        return prev;
      });
    },
    [gameStatus]
  );

  const handleDelete = useCallback(() => {
    if (gameStatus !== 'playing') return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameStatus]);

  const handleEnter = useCallback(() => {
    if (
      gameStatus !== 'playing' ||
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

    // Validar localmente (instantáneo)
    const isValid = validateWordLocal(guessWord);
    if (!isValid) {
      // Animación shake en la fila actual
      const currentRowIndex = attempts.length;
      setShakingRow(currentRowIndex);
      setToast({ message: 'Invalid word', type: 'error' });
      
      // Limpiar shake después de la animación
      setTimeout(() => {
        setShakingRow(null);
      }, 500);
      return;
    }

    // Capturar el índice ANTES de submitGuess (porque submitGuess actualiza attempts inmediatamente)
    const rowIndex = attempts.length;
    
    // Procesar intento (todo local, instantáneo)
    const result = submitGuess(guessWord, dictionary);

    if (result) {
      // Resetear keyboardReadyRow para esta fila, para evitar que se incluya antes de tiempo
      if (keyboardReadyRow !== null && keyboardReadyRow >= rowIndex) {
        setKeyboardReadyRow(rowIndex - 1);
      }
      
      // Iniciar animación inmediatamente (el feedback ya está calculado)
      setRevealingRow(rowIndex);
      setCurrentGuess('');

      // Duración de la animación: 1200ms (según index.css)
      // Delay de la última casilla (índice 4): 4 * 200ms = 800ms
      // Tiempo total hasta que la última casilla termine: delay + animación = 800ms + 1200ms = 2000ms
      const animationDuration = 1200; // Duración de la animación flip
      const lastCellDelay = 4 * 200; // Delay de la última casilla
      const totalDuration = lastCellDelay + animationDuration; // 2000ms
      
      // Actualizar colores del teclado tan pronto como termine la animación
      setTimeout(() => {
        setKeyboardReadyRow(rowIndex);
      }, totalDuration);
      
      // Limpiar revealingRow un poco después para asegurar que la animación visual terminó
      setTimeout(() => {
        setRevealingRow(null);
      }, totalDuration + 50); // 50ms extra para seguridad
    }
  }, [targetWord, currentGuess, gameStatus, dictionaryReady, attempts.length, validateWordLocal, getDictionary, submitGuess]);

  const handleRestartGame = useCallback(() => {
    reset();
    setCurrentGuess('');
    setRevealingRow(null);
    setShakingRow(null);
    setKeyboardReadyRow(null);
    setToast(null);
    
    // Iniciar nuevo juego inmediatamente
    if (dictionaryReady) {
      try {
        startNewGame();
      } catch (err) {
        console.error('Error restarting game:', err);
        setToast({ message: 'Error restarting game. Please try again.', type: 'error' });
      }
    }
  }, [reset, startNewGame, dictionaryReady]);

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

        {(!dictionaryReady || !gameReady) && (
          <div className="text-center text-white">Loading...</div>
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
          isOpen={gameStatus === 'won' || gameStatus === 'lost'}
          isWon={gameStatus === 'won'}
          targetWord={targetWord || ''}
          attempts={attempts.length}
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
