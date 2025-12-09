import React from 'react';

interface GameModeDetailsProps {
  mode: 'classic' | 'timer';
}

export const GameModeDetails: React.FC<GameModeDetailsProps> = ({ mode }) => {
  if (mode === 'classic') {
    return null; // Classic mode doesn't need additional details
  }

  if (mode === 'timer') {
    return (
      <div className="space-y-4 sm:space-y-6 flex flex-col justify-center min-h-[400px]">
        <h3 className="text-white font-semibold text-lg sm:text-xl">
          Timer Mode Details
        </h3>
        <div className="space-y-4 text-sm sm:text-base">
          <div>
            <strong className="text-white text-base sm:text-lg">1. Choose your time:</strong>
            <p className="mt-1">Select how much time you want to challenge yourself with (from 10 seconds to 5 minutes).</p>
          </div>
          <div>
            <strong className="text-white text-base sm:text-lg">2. Start the game:</strong>
            <p className="mt-1">Press START GAME to begin. A countdown will appear (3, 2, 1, GO!).</p>
          </div>
          <div>
            <strong className="text-white text-base sm:text-lg">3. Guess before time runs out:</strong>
            <p className="mt-1">You must guess the word before the timer reaches zero. The timer will be displayed at the top right of the screen.</p>
          </div>
          <div>
            <strong className="text-white text-base sm:text-lg">4. Win or lose:</strong>
            <p className="mt-1">If you guess the word in time, you win! If the timer runs out, you lose.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

