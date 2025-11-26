import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
