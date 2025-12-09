import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { InstructionsModal } from '../../../components/game-modes/classic/InstructionsModal';
import { GameBoard } from '../../../components/game/board/GameBoard';
import { Keyboard } from '../../../components/game/keyboard/Keyboard';
import { CellStatus } from '../../../components/game/board/GameCell';
import { Toast } from '../../../components/ui/Toast';
import { GameOverModal } from '../../../components/game-modes/classic/GameOverModal';
import { TimeSelection } from '../../../components/game-modes/timer/TimeSelection';
import { CountdownOverlay } from '../../../components/game-modes/timer/CountdownOverlay';
import { Timer } from '../../../components/game-modes/timer/Timer';
import { useLocalClassicGame } from '../../../hooks/useLocalClassicGame';
import { useKeyboardColors } from '../../../hooks/useKeyboardColors';
import { useWordDictionary } from '../../../hooks/useWordDictionary';
import { useAuth } from '../../../contexts/AuthContext';
import { statsApi } from '../../../services/api';

interface Guess {
    word: string;
    feedback: CellStatus[];
}

export const TimerGamePage: React.FC = () => {
    const { user } = useAuth();
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
    const gameSavedRef = useRef(false);

    // Timer mode specific states
    const [showTimeSelection, setShowTimeSelection] = useState(true);
    const [showCountdown, setShowCountdown] = useState(false);
    const [timeLimit, setTimeLimit] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeTaken, setTimeTaken] = useState<number | undefined>(undefined);

    // Game states
    const [showInstructions, setShowInstructions] = useState(false);
    const [currentGuess, setCurrentGuess] = useState('');
    const [revealingRow, setRevealingRow] = useState<number | null>(null);
    const [shakingRow, setShakingRow] = useState<number | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
    const [keyboardReadyRow, setKeyboardReadyRow] = useState<number | null>(null);
    const [timeUpLoss, setTimeUpLoss] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);

    const guessesForKeyboard = revealingRow !== null && (keyboardReadyRow === null || keyboardReadyRow < revealingRow)
        ? attempts.slice(0, revealingRow)
        : keyboardReadyRow !== null
            ? attempts.slice(0, keyboardReadyRow + 1)
            : attempts;

    const keyColors = useKeyboardColors(guessesForKeyboard);
    const guesses: Guess[] = attempts;

    // Handle time selection
    const handleTimeSelect = (seconds: number) => {
        setTimeLimit(seconds);
        setShowTimeSelection(false);
        setShowCountdown(true);
    };

    // Handle countdown complete - start the game
    const handleCountdownComplete = () => {
        setShowCountdown(false);
        setIsTimerRunning(true);
        setStartTime(Date.now());

        // Start the game if dictionary is ready
        if (dictionaryReady && gameReady) {
            try {
                startNewGame();
            } catch (err) {
                console.error('Error starting game:', err);
                setToast({ message: 'Error starting game. Please refresh the page.', type: 'error' });
            }
        }
    };

    // Handle time up
    const handleTimeUp = useCallback(() => {
        if (gameStatus === 'playing') {
            setIsTimerRunning(false);
            setTimeUpLoss(true);
            // We'll show a "Time's up!" message in the game over modal
        }
    }, [gameStatus]);

    const handleKeyPress = useCallback(
        (key: string) => {
            if (gameStatus !== 'playing' || !isTimerRunning) return;
            setCurrentGuess((prev) => {
                if (prev.length < 5) {
                    return prev + key;
                }
                return prev;
            });
        },
        [gameStatus, isTimerRunning]
    );

    const handleDelete = useCallback(() => {
        if (gameStatus !== 'playing' || !isTimerRunning) return;
        setCurrentGuess((prev) => prev.slice(0, -1));
    }, [gameStatus, isTimerRunning]);

    const handleEnter = useCallback(() => {
        if (
            gameStatus !== 'playing' ||
            !isTimerRunning ||
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

            // If won, stop the timer
            if (result.isWon) {
                setIsTimerRunning(false);
                if (startTime) {
                    const elapsed = Math.floor((Date.now() - startTime) / 1000);
                    setTimeTaken(elapsed);
                }
            }
        }
    }, [targetWord, currentGuess, gameStatus, isTimerRunning, dictionaryReady, attempts.length, validateWordLocal, getDictionary, submitGuess, keyboardReadyRow, startTime]);

    const handleRestartGame = useCallback(() => {
        reset();
        setCurrentGuess('');
        setRevealingRow(null);
        setShakingRow(null);
        setKeyboardReadyRow(null);
        setToast(null);
        setIsTimerRunning(false);
        setTimeUpLoss(false);
        setStartTime(null);
        setTimeTaken(undefined);
        setShowGameOver(false);
        gameSavedRef.current = false;

        // Show time selection again
        setShowTimeSelection(true);
        setTimeLimit(null);
    }, [reset]);

    // Save game stats when game ends
    useEffect(() => {
        const isGameOver = gameStatus === 'won' || gameStatus === 'lost' || timeUpLoss;

        if (!user || !targetWord || gameStatus === 'playing' || !isGameOver || gameSavedRef.current) {
            return;
        }

        const saveGameStats = async () => {
            try {
                const won = gameStatus === 'won';
                const attemptsUsed = attempts.length;

                await statsApi.saveGame(
                    user.id,
                    'timer',
                    targetWord,
                    won,
                    attemptsUsed,
                    timeLimit || undefined,
                    timeTaken
                );

                gameSavedRef.current = true;
            } catch (error) {
                console.error('Error saving game stats:', error);
            }
        };

        saveGameStats();
    }, [user, targetWord, gameStatus, timeUpLoss, attempts.length, timeLimit, timeTaken]);

    // Keyboard listener
    useEffect(() => {
        if (gameStatus !== 'playing' || !isTimerRunning) return;

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
    }, [gameStatus, isTimerRunning, handleKeyPress, handleDelete, handleEnter, handleRestartGame]);

    const isGameOver = gameStatus === 'won' || gameStatus === 'lost' || timeUpLoss;

    // Show game over modal when game ends
    React.useEffect(() => {
        if (isGameOver) {
            setShowGameOver(true);
        }
    }, [isGameOver]);

    return (
        <Layout
            gameModeTitle="Timer Mode"
            onHelpClick={() => setShowInstructions(true)}
        >
            <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 pt-12 sm:pt-0">
                <Toast
                    message={toast?.message || ''}
                    type={toast?.type || 'error'}
                    isVisible={toast !== null}
                    onClose={() => setToast(null)}
                />

                {/* Time Selection */}
                {showTimeSelection && (
                    <TimeSelection onSelectTime={handleTimeSelect} />
                )}

                {/* Countdown Overlay */}
                {showCountdown && (
                    <CountdownOverlay onComplete={handleCountdownComplete} />
                )}

                {/* Timer Display */}
                {isTimerRunning && timeLimit && !isGameOver && (
                    <div className="flex justify-end mb-4">
                        <Timer
                            timeLimit={timeLimit}
                            isRunning={isTimerRunning}
                            onTimeUp={handleTimeUp}
                        />
                    </div>
                )}

                {(!dictionaryReady || !gameReady) && !showTimeSelection && !showCountdown && (
                    <div className="text-center text-white">Loading...</div>
                )}

                {targetWord && gameStatus && !showTimeSelection && !showCountdown && (
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
                    isOpen={showGameOver && isGameOver}
                    isWon={gameStatus === 'won'}
                    targetWord={targetWord || ''}
                    attempts={attempts.length}
                    onPlayAgain={handleRestartGame}
                    onClose={() => setShowGameOver(false)}
                    customMessage={timeUpLoss ? "Time's up!" : undefined}
                    timeTaken={timeTaken}
                />

                <InstructionsModal
                    isOpen={showInstructions}
                    onClose={() => setShowInstructions(false)}
                    gameMode="timer"
                />
            </div>
        </Layout>
    );
};
