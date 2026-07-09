import React from 'react';
import { BoardCount } from '../../../hooks/useLocalMultiGame';

interface BoardCountSelectionProps {
  onSelect: (count: BoardCount) => void;
}

const options: Array<{ count: BoardCount; label: string; description: string }> = [
  { count: 2, label: '2 Words', description: '7 shared attempts. A gentler start.' },
  { count: 4, label: '4 Words', description: '9 shared attempts. The classic challenge.' },
];

export const BoardCountSelection: React.FC<BoardCountSelectionProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 text-center">
        Multi Mode
      </h1>
      <p className="text-gray-300 text-lg sm:text-xl text-center mb-12">
        Guess every word at once. One guess counts on all boards.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {options.map((option) => (
          <button
            key={option.count}
            onClick={() => onSelect(option.count)}
            className="py-8 px-6 rounded-lg font-semibold text-left bg-gray-700 border-2 border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200"
          >
            <div className="text-2xl text-white mb-2">{option.label}</div>
            <div className="text-gray-300 text-sm font-normal">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
