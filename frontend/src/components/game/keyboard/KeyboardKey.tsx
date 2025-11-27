import React from 'react';

export type KeyStatus = 'correct' | 'present' | 'absent' | 'none';

interface KeyboardKeyProps {
  keyValue: string;
  onClick: () => void;
  isPressed?: boolean;
  status?: KeyStatus;
}

export const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  keyValue,
  onClick,
  isPressed = false,
  status = 'none',
}) => {
  const isSpecialKey = keyValue === 'ENTER' || keyValue === 'DELETE';
  const width = isSpecialKey
    ? 'w-[72px] sm:w-16 md:w-20 lg:w-24'
    : 'w-12 sm:w-10 md:w-12 lg:w-14';

  const getStatusStyles = () => {
    switch (status) {
      case 'correct':
        // Mismo verde que las casillas pero más apagado (75% opacidad)
        return 'bg-[#5a8a54] hover:bg-[#508050] active:bg-[#467046] text-white border-[#5a8a54]';
      case 'present':
        // Mismo amarillo que las casillas pero más apagado (75% opacidad)
        return 'bg-[#b8a048] hover:bg-[#a89038] active:bg-[#988028] text-white border-[#b8a048]';
      case 'absent':
        // Más oscuro cuando sabemos que no está en la palabra
        return 'bg-gray-700 hover:bg-gray-650 active:bg-gray-600 text-white border-gray-700';
      default:
        // No usadas - más claro que absent
        return 'bg-gray-500 hover:bg-gray-450 active:bg-gray-400 text-white border-gray-500';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${width} h-14 sm:h-12 md:h-14 lg:h-16 rounded-lg font-semibold text-base sm:text-sm md:text-base lg:text-lg
        transition-all duration-200 border-2
        ${getStatusStyles()}
        ${isPressed && status === 'none' ? '!bg-wordle-correct' : ''}
        active:scale-95 touch-manipulation
        min-h-[44px] sm:min-h-0
      `}
    >
      {keyValue === 'DELETE' ? '⌫' : keyValue}
    </button>
  );
};
