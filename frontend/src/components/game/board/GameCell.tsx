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
  flipDelay = 0,
}) => {
  const [displayStatus, setDisplayStatus] = useState<CellStatus>(
    status === 'empty' ? 'empty' : 'filled'
  );

  useEffect(() => {
    if (isFlipping) {
      // Al inicio del flip, mantener 'filled' (gris)
      setDisplayStatus('filled');
      
      // Cambiar al color final a mitad de la animación (cuando está de lado)
      // La animación dura 1.2s, así que cambiamos a los 600ms (mitad)
      const timer = setTimeout(() => {
        setDisplayStatus(status);
      }, 600 + flipDelay); // Sumar el delay de esta casilla específica

      return () => clearTimeout(timer);
    } else {
      // Si no está haciendo flip, mostrar el status directamente
      if (status !== 'empty' && status !== 'filled') {
        setDisplayStatus(status);
      } else if (status === 'empty') {
        setDisplayStatus('empty');
      } else {
        setDisplayStatus('filled');
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
      className={`aspect-square w-full max-w-[48px] sm:max-w-[56px] md:max-w-[64px] lg:max-w-[70px] rounded border-2 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold uppercase transition-colors duration-300 ${getStatusStyles()} ${
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
