import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MultiBoardState } from '../../../utils/gameLogic';

interface MultiGameOverModalProps {
  isOpen: boolean;
  isWon: boolean;
  boards: MultiBoardState[];
  attemptsUsed: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const MultiGameOverModal: React.FC<MultiGameOverModalProps> = ({
  isOpen,
  isWon,
  boards,
  attemptsUsed,
  onPlayAgain,
  onClose,
}) => {
  const navigate = useNavigate();
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div ref={modalRef} className="relative bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 border-2 border-gray-600">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          CLOSE
        </button>

        <div className="text-center mt-4">
          <div className="text-3xl mb-4">{isWon ? '🎉' : '😔'}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isWon ? 'Congratulations!' : 'Out of attempts'}
          </h2>
          <p className="text-gray-400 mb-6">
            {isWon
              ? `You solved all ${boards.length} words in ${attemptsUsed} attempts.`
              : 'Here are the words you were looking for:'}
          </p>

          <div className="space-y-3 mb-6">
            {boards.map((board, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                {board.targetWord.split('').map((letter, letterIndex) => (
                  <div
                    key={letterIndex}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded border-2 flex items-center justify-center text-white font-bold uppercase text-sm sm:text-base ${
                      board.solved
                        ? 'bg-wordle-correct border-wordle-correct'
                        : 'bg-gray-600 border-gray-500'
                    }`}
                  >
                    {letter}
                  </div>
                ))}
                {!board.solved && <span className="text-gray-500 text-sm ml-2">not solved</span>}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 bg-wordle-correct hover:bg-[#5a9a54] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/home')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
