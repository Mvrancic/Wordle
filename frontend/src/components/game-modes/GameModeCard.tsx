import React from 'react';
import { Card } from '../ui/Card';

interface GameMode {
  id: string;
  title: string;
  description: string;
  available: boolean;
}

interface GameModeCardProps {
  mode: GameMode;
  onClick: () => void;
}

export const GameModeCard: React.FC<GameModeCardProps> = ({
  mode,
  onClick,
}) => {
  return (
    <Card
      className={`h-full min-h-[240px] sm:min-h-[260px] flex flex-col justify-center transition-all duration-200 ${
        mode.available
          ? 'cursor-pointer hover:border-wordle-correct hover:shadow-lg hover:shadow-wordle-correct/20 hover:scale-105'
          : 'opacity-50 cursor-default'
      }`}
      onClick={mode.available ? onClick : undefined}
    >
      <div className="text-center space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{mode.title}</h3>
        <p className="text-gray-300 text-sm sm:text-base md:text-lg px-4">{mode.description}</p>
        {!mode.available && (
          <span className="inline-block text-sm text-gray-500 italic">
            Coming Soon
          </span>
        )}
      </div>
    </Card>
  );
};
