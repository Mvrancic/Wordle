import React from 'react';
import { GameRow } from './GameRow';
import { CellStatus } from './GameCell';

interface Guess {
  word: string;
  feedback: CellStatus[];
}

interface GameBoardProps {
  guesses: Guess[];
  currentGuess: string;
  maxAttempts?: number;
  revealingRow?: number | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  guesses,
  currentGuess,
  maxAttempts = 6,
  revealingRow = null,
}) => {
  const rows = Array.from({ length: maxAttempts }, (_, index) => {
    const guess = guesses[index];
    const isActive = index === guesses.length && currentGuess.length > 0;
    const isRevealing = revealingRow === index;

    return {
      word: guess?.word || (isActive ? currentGuess : ''),
      feedback: guess?.feedback,
      isActive,
      isRevealing,
    };
  });

  return (
    <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
      {rows.map((row, index) => (
        <GameRow
          key={index}
          word={row.word}
          feedback={row.feedback}
          isActive={row.isActive}
          isRevealing={row.isRevealing}
        />
      ))}
    </div>
  );
};
