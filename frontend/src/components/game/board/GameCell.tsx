import React, { useState, useEffect } from 'react';

export type CellStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

interface GameCellProps {
  letter?: string;
  status: CellStatus;
  isActive?: boolean;
  isFlipping?: boolean;
  flipDelay?: number;
}

export const GameCell: React.FC<GameCellProps> = ({ 
  letter, 
  status, 
  isActive = false,
  isFlipping = false,
  flipDelay = 0
}) => {
  const [displayStatus, setDisplayStatus] = useState<CellStatus>(status === 'empty' ? 'empty' : 'filled');

  useEffect(() => {
    if (isFlipping) {
      // Cambiar al estado final en la mitad de la animación
      const timer = setTimeout(() => {
        setDisplayStatus(status);
      }, flipDelay + 250); // 250ms es la mitad de la animación
      
      return () => clearTimeout(timer);
    } else {
      // Si no está haciendo flip, mostrar el status directamente
      if (status !== 'empty') {
        setDisplayStatus(status);
      } else {
        setDisplayStatus('empty');
      }
    }
  }, [isFlipping, status, flipDelay]);

  const getStatusStyles = () => {
    switch (displayStatus) {
      case 'correct':
        return 'bg-wordle-correct text-white border-wordle-correct';
      case 'present':
        return 'bg-yellow-500 text-white border-yellow-500';
      case 'absent':
        return 'bg-gray-600 text-white border-gray-600';
      case 'filled':
        return 'bg-gray-700 text-white border-gray-600';
      default:
        return isActive
          ? 'bg-gray-800 border-2 border-wordle-correct'
          : 'bg-gray-800 border-2 border-gray-600';
    }
  };

  return (
    <div
      className={`aspect-square w-full max-w-[48px] sm:max-w-[56px] md:max-w-[64px] lg:max-w-[70px] rounded border-2 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold uppercase transition-colors duration-200 ${getStatusStyles()} ${
        isFlipping ? 'flip-animation' : ''
      }`}
      style={{
        animationDelay: `${flipDelay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {letter}
    </div>
  );
};
