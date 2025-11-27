import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { GameModeCard } from '../components/game-modes/GameModeCard';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const gameModes = [
    {
      id: 'classic',
      title: 'Classic Mode',
      description:
        'Play unlimited games. Guess 5-letter words with 6 attempts.',
      available: true,
    },
    // Future game modes (disabled for now)
    {
      id: 'timer',
      title: 'Timer Mode',
      description: 'Guess words as fast as possible.',
      available: false,
    },
    {
      id: 'hardcore',
      title: 'Hard Mode',
      description: 'You must use all the clues you get in each attempt.',
      available: false,
    },
    {
      id: 'daily',
      title: 'Daily Word',
      description: 'A new word every day. Can you guess it?',
      available: false,
    },
  ];

  const handleModeClick = (modeId: string) => {
    if (modeId === 'classic') {
      navigate('/game/classic');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 font-serif tracking-wide">
            Welcome to Wordle 
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl">
            Choose your game mode
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameModes.map(mode => (
            <GameModeCard
              key={mode.id}
              mode={mode}
              onClick={() => handleModeClick(mode.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};
