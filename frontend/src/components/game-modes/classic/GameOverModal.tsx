import React from 'react';

interface GameOverModalProps {
  isOpen: boolean;
  isWon: boolean;
  targetWord: string;
  attempts: number;
  onPlayAgain: () => void;
  onClose?: () => void;
  customMessage?: string; // Optional custom message for the loss screen
  timeTaken?: number; // Optional time taken in seconds
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isWon,
  targetWord,
  attempts,
  onPlayAgain,
  onClose,
  customMessage,
  timeTaken,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close
  React.useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div ref={modalRef} className="relative bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 border-2 border-gray-600">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            CLOSE
          </button>
        )}

        {isWon ? (
          <div className="text-center mt-4">
            <div className="text-3xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Congratulations!
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              You guessed the word
            </p>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center gap-2 text-3xl font-bold text-wordle-correct mb-2">
                {targetWord.split('').map((letter, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-wordle-correct text-white rounded border-2 border-wordle-correct flex items-center justify-center uppercase"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-8 mb-6">
              <p className="text-gray-400">
                Attempts: <span className="font-bold text-white">{attempts}</span>
              </p>
              {timeTaken !== undefined && (
                <p className="text-gray-400">
                  Time: <span className="font-bold text-white">{formatTime(timeTaken)}</span>
                </p>
              )}
            </div>
            <button
              onClick={onPlayAgain}
              className="w-full bg-wordle-correct hover:bg-[#5a9a54] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="text-center mt-4">
            <div className="text-3xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {customMessage || 'Sorry'}
            </h2>
            <p className="text-lg text-gray-300 mb-2">
              The word was:
            </p>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center gap-2 text-3xl font-bold text-white mb-4">
                {targetWord.split('').map((letter, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-gray-600 text-white rounded border-2 border-gray-500 flex items-center justify-center uppercase"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Try again!
            </p>
            <button
              onClick={onPlayAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

