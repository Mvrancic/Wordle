import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { InstructionsModal } from '../../../components/game-modes/classic/InstructionsModal';
import { GameBoard } from '../../../components/game/board/GameBoard';
import { Keyboard } from '../../../components/game/keyboard/Keyboard';
import { CellStatus } from '../../../components/game/board/GameCell';

interface Guess {
  word: string;
  feedback: CellStatus[];
}

export const ClassicGamePage: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  // TODO: Obtener palabra del backend

  // Mostrar tooltip al entrar a la página
  useEffect(() => {
    const hasSeenTooltip = sessionStorage.getItem('wordle-help-tooltip-seen');
    if (!hasSeenTooltip) {
      setShowHelpTooltip(true);
      const timer = setTimeout(() => {
        setShowHelpTooltip(false);
        sessionStorage.setItem('wordle-help-tooltip-seen', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
    setGameStarted(true);
  }, []);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (!gameStarted) return;
      setCurrentGuess(prev => {
        if (prev.length < 5) {
          return prev + key;
        }
        return prev;
      });
    },
    [gameStarted]
  );

  const handleDelete = useCallback(() => {
    if (!gameStarted) return;
    setCurrentGuess(prev => prev.slice(0, -1));
  }, [gameStarted]);

  const handleEnter = useCallback(() => {
    if (!gameStarted || currentGuess.length !== 5) return;

    // Validar que sea una palabra válida (por ahora cualquier palabra de 5 letras)
    // TODO: Validar contra diccionario del backend
    // TODO: Obtener palabra del backend y generar feedback

    // Por ahora, solo agregamos el intento sin feedback (todas las casillas en gris)
    const feedback: CellStatus[] = Array(5).fill('absent');
    const newGuess: Guess = {
      word: currentGuess.toUpperCase(),
      feedback,
    };

    setGuesses(prev => {
      const newGuesses = [...prev, newGuess];
      setRevealingRow(prev.length);
      return newGuesses;
    });

    setCurrentGuess('');

    // Limpiar la animación después de que termine
    setTimeout(() => {
      setRevealingRow(null);
    }, 1100); // 5 casillas * 100ms delay + 600ms animación
  }, [gameStarted, currentGuess]);

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyboardPress = (e: KeyboardEvent) => {
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
  }, [gameStarted, handleKeyPress, handleDelete, handleEnter]);

  return (
    <Layout
      gameModeTitle="Modo Clásico"
      onHelpClick={() => setShowInstructions(true)}
      showHelpTooltip={showHelpTooltip}
    >
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 pt-12 sm:pt-0">
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

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
      </div>
    </Layout>
  );
};
