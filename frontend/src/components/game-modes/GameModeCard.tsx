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
      className={`cursor-pointer transition-all duration-200 ${
        mode.available
          ? 'hover:border-wordle-correct hover:shadow-lg hover:shadow-wordle-correct/20'
          : 'opacity-50 cursor-not-allowed'
      }`}
      onClick={mode.available ? onClick : undefined}
    >
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">{mode.title}</h3>
        <p className="text-gray-300">{mode.description}</p>
        {!mode.available && (
          <span className="inline-block text-sm text-gray-500 italic">
            Coming Soon
          </span>
        )}
      </div>
    </Card>
  );
};
