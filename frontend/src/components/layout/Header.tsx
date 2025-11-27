import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HamburgerMenu } from '../ui/HamburgerMenu';

interface HeaderProps {
  gameModeTitle?: string;
  onHelpClick?: () => void;
  showHelpTooltip?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  gameModeTitle,
  onHelpClick,
  showHelpTooltip = false,
}) => {
  const location = useLocation();
  const isGamePage = location.pathname.includes('/game/');

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/profile' }, // TODO: implement later
  ];

  if (isGamePage) {
    // En modo juego: contenedor de ancho completo con contenido centrado
    return (
      <header className="bg-gray-900 border-b border-gray-800 w-full">
        <div className="max-w-2xl mx-auto relative px-2 sm:px-0">
          <div className="flex justify-between items-center h-14 sm:h-16 relative">
            {/* Izquierda: Logo - completamente a la izquierda sin padding */}
            <Link
              to="/"
              className="flex items-center absolute left-0 sm:left-0"
            >
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-serif tracking-wide">
                WORDLE
              </h1>
            </Link>

            {/* Centro: Título del modo de juego */}
            {gameModeTitle && (
              <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                  {gameModeTitle}
                </h2>
              </div>
            )}

            {/* Derecha: Instrucciones (?) primero, luego Menú - completamente a la derecha */}
            <div className="flex items-center gap-2 sm:gap-4 absolute right-0">
              <div className="relative">
                {showHelpTooltip && (
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap border border-gray-700 z-10">
                    Instructions are here
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
                <button
                  onClick={onHelpClick}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-base sm:text-lg flex items-center justify-center transition-colors"
                  aria-label="Instructions"
                >
                  ?
                </button>
              </div>
              <HamburgerMenu items={menuItems} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Página normal (Home)
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-serif tracking-wide">
              WORDLE
            </h1>
          </Link>
          <HamburgerMenu items={menuItems} />
        </div>
      </div>
    </header>
  );
};
