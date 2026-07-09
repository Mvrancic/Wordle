import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { InstructionsModal } from '../../../components/game-modes/classic/InstructionsModal';
import { BoardCountSelection } from '../../../components/game-modes/multi/BoardCountSelection';
import { MultiGameOverModal } from '../../../components/game-modes/multi/MultiGameOverModal';
import { GameBoard } from '../../../components/game/board/GameBoard';
import { Keyboard } from '../../../components/game/keyboard/Keyboard';
import { Toast } from '../../../components/ui/Toast';
import { useLocalMultiGame, BoardCount } from '../../../hooks/useLocalMultiGame';
import { useKeyboardColors } from '../../../hooks/useKeyboardColors';
import { useWordDictionary } from '../../../hooks/useWordDictionary';
import { useAuth } from '../../../contexts/AuthContext';
import { statsApi } from '../../../services/api';

const ANIMATION_DURATION = 1200;
const LAST_CELL_DELAY = 4 * 200;
const TOTAL_ANIMATION_DURATION = LAST_CELL_DELAY + ANIMATION_DURATION;

export const MultiGamePage: React.FC = () => {
  const { user } = useAuth();
  const [boardCount, setBoardCount] = useState<BoardCount>(2);
  const [hasStarted, setHasStarted] = useState(false);

  const { boards, maxAttempts, gameStatus, isReady: gameReady, startNewGame, submitGuess, reset } =
    useLocalMultiGame(boardCount);

  const { isReady: dictionaryReady, validateWord: validateWordLocal, getDictionary } = useWordDictionary();
  const gameSavedRef = useRef(false);

  const [showInstructions, setShowInstructions] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [revealingRows, setRevealingRows] = useState<Array<number | null>>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  useEffect(() => {
    if (hasStarted && dictionaryReady && gameReady && boards.length === 0) {
      try {
        startNewGame();
      } catch (err) {
        setToast({ message: 'Error starting game. Please refresh the page.', type: 'error' });
      }
    }
  }, [hasStarted, dictionaryReady, gameReady, boards.length, startNewGame]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      setShowGameOver(false);
      setModalDismissed(false);
    }
  }, [gameStatus]);

  const allGuesses = boards.flatMap((board) => board.attempts);
  const keyColors = useKeyboardColors(allGuesses);

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
    if (gameStatus !== 'playing' || currentGuess.length !== 5 || !dictionaryReady) {
      return;
    }

    const guessWord = currentGuess.toUpperCase();
    const dictionary = getDictionary();

    if (!dictionary) {
      setToast({ message: 'Dictionary not loaded. Please wait.', type: 'error' });
      return;
    }

    if (!validateWordLocal(guessWord)) {
      setIsShaking(true);
      setToast({ message: 'Invalid word', type: 'error' });
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const preBoards = boards;
    const result = submitGuess(guessWord);

    if (result) {
      setRevealingRows(preBoards.map((board) => (board.solved ? null : board.attempts.length)));
      setCurrentGuess('');

      setTimeout(() => {
        setRevealingRows(preBoards.map(() => null));
      }, TOTAL_ANIMATION_DURATION + 50);
    }
  }, [gameStatus, currentGuess, dictionaryReady, validateWordLocal, getDictionary, boards, submitGuess]);

  const handleSelectBoardCount = useCallback((count: BoardCount) => {
    setBoardCount(count);
    setHasStarted(true);
  }, []);

  const handleRestartGame = useCallback(() => {
    reset();
    setCurrentGuess('');
    setRevealingRows([]);
    setIsShaking(false);
    setToast(null);
    setShowGameOver(false);
    gameSavedRef.current = false;
    setHasStarted(false);
  }, [reset]);

  // Save game stats when the game ends
  useEffect(() => {
    const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

    if (!user || boards.length === 0 || !isGameOver || gameSavedRef.current) {
      return;
    }

    const saveGameStats = async () => {
      try {
        const mode = `multi${boardCount}`;
        const attemptsUsed = boards.reduce((max, board) => Math.max(max, board.attempts.length), 0);
        await statsApi.saveGame(mode, boards.map((b) => b.targetWord).join(','), gameStatus === 'won', attemptsUsed);
        gameSavedRef.current = true;
      } catch (error) {
        // Silently handle error
      }
    };

    saveGameStats();
  }, [user, boards, gameStatus, boardCount]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const handleKeyboardPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
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
  }, [gameStatus, handleKeyPress, handleDelete, handleEnter, handleRestartGame]);

  useEffect(() => {
    if ((gameStatus === 'won' || gameStatus === 'lost') && !modalDismissed) {
      setShowGameOver(true);
    }
  }, [gameStatus, modalDismissed]);

  const handleCloseModal = useCallback(() => {
    setShowGameOver(false);
    setModalDismissed(true);
  }, []);

  const attemptsUsed = boards.reduce((max, board) => Math.max(max, board.attempts.length), 0);

  return (
    <Layout gameModeTitle="Multi Mode" onHelpClick={() => setShowInstructions(true)}>
      <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 pt-12 sm:pt-0">
        <Toast
          message={toast?.message || ''}
          type={toast?.type || 'error'}
          isVisible={toast !== null}
          onClose={() => setToast(null)}
        />

        {!hasStarted && <BoardCountSelection onSelect={handleSelectBoardCount} />}

        {hasStarted && (!dictionaryReady || !gameReady || boards.length === 0) && (
          <div className="text-center text-white">Loading...</div>
        )}

        {hasStarted && boards.length > 0 && (
          <>
            <p className="text-center text-gray-400 text-sm mb-6">
              Attempt {Math.min(attemptsUsed + (gameStatus === 'playing' ? 1 : 0), maxAttempts)} of {maxAttempts}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
              {boards.map((board, index) => (
                <div key={index} className={board.solved ? 'opacity-80' : ''}>
                  <GameBoard
                    guesses={board.attempts}
                    currentGuess={board.solved ? '' : currentGuess}
                    maxAttempts={maxAttempts}
                    revealingRow={revealingRows[index] ?? null}
                    shakingRow={isShaking && !board.solved ? board.attempts.length : null}
                  />
                </div>
              ))}
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

        <MultiGameOverModal
          isOpen={showGameOver && (gameStatus === 'won' || gameStatus === 'lost')}
          isWon={gameStatus === 'won'}
          boards={boards}
          attemptsUsed={attemptsUsed}
          onPlayAgain={handleRestartGame}
          onClose={handleCloseModal}
        />

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          gameMode="multi"
        />
      </div>
    </Layout>
  );
};
