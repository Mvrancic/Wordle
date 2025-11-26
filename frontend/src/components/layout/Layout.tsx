import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  gameModeTitle?: string;
  onHelpClick?: () => void;
  showHelpTooltip?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  gameModeTitle,
  onHelpClick,
  showHelpTooltip,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header
        gameModeTitle={gameModeTitle}
        onHelpClick={onHelpClick}
        showHelpTooltip={showHelpTooltip}
      />
      <main
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${gameModeTitle ? 'py-0 sm:py-6 md:py-8' : 'py-4 sm:py-6 md:py-8'}`}
      >
        {children}
      </main>
    </div>
  );
};
