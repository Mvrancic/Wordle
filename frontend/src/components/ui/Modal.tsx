import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {title}
            </h2>
          </div>
        )}
        <div className="px-4 sm:px-6 py-3 sm:py-4">{children}</div>
        {onClose && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
