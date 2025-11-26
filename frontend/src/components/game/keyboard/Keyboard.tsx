import React from 'react';
import { KeyboardKey } from './KeyboardKey';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onDelete: () => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
];

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onEnter,
  onDelete,
}) => {
  const handleKeyClick = (key: string) => {
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'DELETE') {
      onDelete();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="space-y-2.5 sm:space-y-1.5 md:space-y-2 max-w-2xl mx-auto px-2 sm:px-0 pb-4 sm:pb-0">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 sm:gap-1 md:gap-1.5 justify-center">
          {row.map((key) => (
            <KeyboardKey
              key={key}
              keyValue={key}
              onClick={() => handleKeyClick(key)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
