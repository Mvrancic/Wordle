import React from 'react';
import { GameCell, CellStatus } from './GameCell';

interface GameRowProps {
  word: string;
  feedback?: CellStatus[];
  isActive?: boolean;
  isRevealing?: boolean;
  shouldShake?: boolean;
}

export const GameRow: React.FC<GameRowProps> = ({
  word,
  feedback,
  isActive = false,
  isRevealing = false,
  shouldShake = false,
}) => {
  const cells = Array.from({ length: 5 }, (_, index) => {
    const letter = word[index]?.toUpperCase();
    let status: CellStatus = 'empty';
    const hasFeedback = feedback && feedback[index] !== undefined;

    if (hasFeedback) {
      status = feedback![index];
    } else if (letter) {
      status = 'filled';
    }

    return {
      letter,
      status,
      flipDelay: index * 200, // 250ms delay entre cada casilla (animación más espaciada)
      shouldFlip: hasFeedback && isRevealing,
    };
  });

  return (
    <div
      className={`flex gap-1.5 sm:gap-2 md:gap-2.5 justify-center ${
        shouldShake ? 'shake-animation' : ''
      }`}
    >
      {cells.map((cell, index) => (
        <GameCell
          key={index}
          letter={cell.letter}
          status={cell.status}
          isActive={isActive && index === word.length}
          isFlipping={cell.shouldFlip}
          flipDelay={cell.flipDelay}
        />
      ))}
    </div>
  );
};
