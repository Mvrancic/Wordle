import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'error',
  isVisible,
  onClose,
  duration = 1500,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === 'error'
      ? 'bg-red-600'
      : type === 'success'
        ? 'bg-green-600'
        : 'bg-blue-600';

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div
        className={`
          ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg
          font-medium text-sm sm:text-base
          flex items-center justify-center
          min-w-[200px] sm:min-w-[300px]
        `}
      >
        {message}
      </div>
    </div>
  );
};

