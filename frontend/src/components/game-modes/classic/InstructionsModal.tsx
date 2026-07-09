import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { GameModeDetails } from '../shared/GameModeDetails';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode?: 'classic' | 'timer' | 'hard' | 'multi';
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  gameMode = 'classic',
}) => {
  const [activeTab, setActiveTab] = useState<'how-to-play' | 'mode-details'>('how-to-play');

  const hasModeDetails = gameMode === 'timer' || gameMode === 'hard' || gameMode === 'multi';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play" showCloseButton={true}>
      {hasModeDetails && (
        <div className="flex border-b border-gray-700 mb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('how-to-play')}
            className={`
              flex-1 px-4 py-2 font-medium text-sm transition-colors text-center
              ${activeTab === 'how-to-play'
                ? 'text-white border-b-2 border-green-500'
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            How to Play
          </button>
          <button
            onClick={() => setActiveTab('mode-details')}
            className={`
              flex-1 px-4 py-2 font-medium text-sm transition-colors text-center
              ${activeTab === 'mode-details'
                ? 'text-white border-b-2 border-green-500'
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            {gameMode === 'timer' ? 'Timer Mode' : gameMode === 'multi' ? 'Multi Mode' : 'Hard Mode'}
          </button>
        </div>
      )}

      <div className="space-y-4 sm:space-y-6 text-gray-300 text-sm sm:text-base min-h-[400px] flex flex-col">
        {activeTab === 'how-to-play' && (
          <div className="flex flex-col justify-center flex-1">
            <p>Guess the hidden word in 6 attempts.</p>
            <p>
              Each attempt must be a valid 5-letter word. You cannot
              enter random letters. Press the Enter button to submit your
              attempt.
            </p>
            <p>
              After your submission, the color of the tiles will change as shown in the
              examples below.
            </p>

            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-700 mt-4">
              <h3 className="text-white font-semibold text-base sm:text-lg">
                Examples
              </h3>

              {/* Ejemplo 1 - Verde (G en GAMES) */}
              <div className="space-y-2">
                <div className="flex gap-1.5 sm:gap-2 justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-wordle-correct rounded border-2 border-wordle-correct flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    G
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    A
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    M
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    E
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    S
                  </div>
                </div>
                <p className="text-sm">
                  The letter <strong className="text-wordle-correct">G</strong> is
                  in the word and in the correct position.
                </p>
              </div>

              {/* Ejemplo 2 - Amarillo (O en HOTEL) */}
              <div className="space-y-2">
                <div className="flex gap-1.5 sm:gap-2 justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    H
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded border-2 border-yellow-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    O
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    T
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    E
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    L
                  </div>
                </div>
                <p className="text-sm">
                  The letter <strong className="text-yellow-500">O</strong> is in the
                  word but in the wrong position.
                </p>
              </div>

              {/* Ejemplo 3 - Gris (segunda C en CLICK) */}
              <div className="space-y-2">
                <div className="flex gap-1.5 sm:gap-2 justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    C
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    L
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded border-2 border-gray-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    I
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    C
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    K
                  </div>
                </div>
                <p className="text-sm">
                  The letter <strong className="text-gray-400">I</strong> is not in
                  the word in any position.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mode-details' && hasModeDetails && (
          <GameModeDetails mode={gameMode} />
        )}
      </div>
    </Modal>
  );
};
