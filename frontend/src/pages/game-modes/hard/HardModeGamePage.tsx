import React from 'react';
import { Layout } from '../../../components/layout/Layout';
import { InstructionsModal } from '../../../components/game-modes/classic/InstructionsModal';
import { GameBoard } from '../../../components/game/board/GameBoard';
import { Keyboard } from '../../../components/game/keyboard/Keyboard';
import { Toast } from '../../../components/ui/Toast';
import { GameOverModal } from '../../../components/game-modes/classic/GameOverModal';
import { useLocalHardGame } from '../../../hooks/useLocalHardGame';
import { useGamePageLogic } from '../../../hooks/useGamePageLogic';
import { validateHardMode } from '../../../utils/gameLogic';

export const HardModeGamePage: React.FC = () => {
  const {
    targetWord,
    attempts,
    gameStatus,
    maxAttempts,
    isReady: gameReady,
    startNewGame,
    submitGuess,
    reset,
  } = useLocalHardGame();

  const {
    showInstructions,
    setShowInstructions,
    showHelpTooltip,
    currentGuess,
    revealingRow,
    shakingRow,
    toast,
    setToast,
    showGameOver,
    setShowGameOver,
    guesses,
    keyColors,
    dictionaryReady,
    gameReady: logicReady,
    handleKeyPress,
    handleDelete,
    handleEnter,
    handleRestartGame,
  } = useGamePageLogic({
    targetWord,
    attempts,
    gameStatus,
    maxAttempts,
    isReady: gameReady,
    startNewGame,
    submitGuess,
    reset,
    gameMode: 'hard',
    validateGuess: (guess, attempts) => {
      if (attempts.length === 0) return { isValid: true };
      return validateHardMode(guess, attempts);
    },
    tooltipKey: 'wordle-hard-help-tooltip-seen',
  });


  return (
    <Layout
      gameModeTitle="Hard Mode"
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

        {(!dictionaryReady || !logicReady) && (
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
          isOpen={showGameOver && (gameStatus === 'won' || gameStatus === 'lost')}
          isWon={gameStatus === 'won'}
          targetWord={targetWord || ''}
          attempts={attempts.length}
          onPlayAgain={handleRestartGame}
          onClose={setShowGameOver}
        />

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          gameMode="hard"
        />
      </div>
    </Layout>
  );
};
