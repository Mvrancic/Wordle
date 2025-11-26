import React from 'react';

interface KeyboardKeyProps {
  keyValue: string;
  onClick: () => void;
  isPressed?: boolean;
}

export const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  keyValue,
  onClick,
  isPressed = false,
}) => {
  const isSpecialKey = keyValue === 'ENTER' || keyValue === 'DELETE';
  const width = isSpecialKey ? 'w-[72px] sm:w-16 md:w-20 lg:w-24' : 'w-12 sm:w-10 md:w-12 lg:w-14';

  return (
    <button
      onClick={onClick}
      className={`
        ${width} h-14 sm:h-12 md:h-14 lg:h-16 rounded-lg font-semibold text-base sm:text-sm md:text-base lg:text-lg
        transition-all duration-150
        bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white
        ${isPressed ? '!bg-wordle-correct' : ''}
        active:scale-95 touch-manipulation
        min-h-[44px] sm:min-h-0
      `}
    >
      {keyValue === 'DELETE' ? '⌫' : keyValue}
    </button>
  );
};
