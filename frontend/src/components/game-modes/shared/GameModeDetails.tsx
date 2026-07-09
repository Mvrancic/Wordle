import React from 'react';

interface GameModeDetailsProps {
  mode: 'classic' | 'timer' | 'hard' | 'multi';
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

  if (mode === 'hard') {
    return (
      <div className="space-y-4 sm:space-y-6 flex flex-col justify-center min-h-[400px]">
        <h3 className="text-white font-semibold text-lg sm:text-xl">
          Hard Mode Rules
        </h3>
        <div className="space-y-4 text-sm sm:text-base">
          <p className="text-gray-300">
            Hard Mode is similar to Classic Mode, but with one important difference: 
            you <strong className="text-white">must use all the clues</strong> you receive in each attempt.
          </p>
          
          <div className="space-y-3 pt-2 border-t border-gray-700">
            <div>
              <strong className="text-white text-base sm:text-lg flex items-center gap-2">
                <span className="w-6 h-6 bg-wordle-correct rounded flex items-center justify-center text-white text-xs">✓</span>
                Green Letters (Correct Position)
              </strong>
              <p className="mt-1 ml-8">
                If a letter appears in <strong className="text-wordle-correct">green</strong>, you <strong className="text-white">must</strong> use that letter in the same position in all future attempts. You can also try it in other positions if you want.
              </p>
            </div>
            
            <div>
              <strong className="text-white text-base sm:text-lg flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs">!</span>
                Yellow Letters (Wrong Position)
              </strong>
              <p className="mt-1 ml-8">
                If a letter appears in <strong className="text-yellow-500">yellow</strong>, you <strong className="text-white">must</strong> include that letter in all future attempts, but not in the same position where it was yellow.
              </p>
            </div>
            
            <div>
              <strong className="text-white text-base sm:text-lg flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs">✗</span>
                Gray Letters (Not in Word)
              </strong>
              <p className="mt-1 ml-8">
                If a letter appears in <strong className="text-gray-400">gray</strong>, you <strong className="text-white">cannot</strong> use that letter again in any future attempts.
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-700">
            <p className="text-gray-300 text-xs sm:text-sm">
              <strong className="text-white">Note:</strong> If you violate any of these rules, your guess will be rejected with an error message explaining what you need to fix.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'multi') {
    return (
      <div className="space-y-4 sm:space-y-6 flex flex-col justify-center min-h-[400px]">
        <h3 className="text-white font-semibold text-lg sm:text-xl">
          Multi Mode Rules
        </h3>
        <div className="space-y-4 text-sm sm:text-base">
          <div>
            <strong className="text-white text-base sm:text-lg">1. Choose your board count:</strong>
            <p className="mt-1">Pick 2 or 4 words to guess at the same time.</p>
          </div>
          <div>
            <strong className="text-white text-base sm:text-lg">2. One guess, every board:</strong>
            <p className="mt-1">Each guess you type is evaluated against every board that isn&apos;t solved yet.</p>
          </div>
          <div>
            <strong className="text-white text-base sm:text-lg">3. Shared attempts:</strong>
            <p className="mt-1">You get boardCount + 5 attempts total (7 for 2 words, 9 for 4 words) to solve them all.</p>
          </div>
          <div>
            <strong className="text-white text-base sm:text-lg">4. Solved boards lock in:</strong>
            <p className="mt-1">Once you solve a board it stops changing — keep going on the rest with your remaining attempts.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

