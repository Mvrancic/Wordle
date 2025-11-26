import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { GameModeCard } from '../components/game-modes/GameModeCard';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const gameModes = [
    {
      id: 'classic',
      title: 'Modo Clásico',
      description:
        'Juega partidas ilimitadas. Adivina palabras de 5 letras con 6 intentos.',
      available: true,
    },
    // Futuros modos de juego (deshabilitados por ahora)
    {
      id: 'timer',
      title: 'Modo Contrareloj',
      description: 'Adivina palabras lo más rápido posible.',
      available: false,
    },
    {
      id: 'accented',
      title: 'Con Tildes',
      description: 'Palabras con acentos y caracteres especiales.',
      available: false,
    },
    {
      id: 'daily',
      title: 'Palabra del Día',
      description: 'Una palabra nueva cada día. ¿Podrás adivinarla?',
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
            WORDLE
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl">
            Elige tu modo de juego
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
