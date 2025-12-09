import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto relative"
      >
        {(showCloseButton || title) && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 relative">
            {title && (
              <h2 className={`text-xl sm:text-2xl font-bold text-white ${showCloseButton ? 'text-center' : ''}`}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-4 sm:right-6 text-gray-400 hover:text-white transition-colors font-medium text-sm"
              >
                CLOSE
              </button>
            )}
          </div>
        )}
        <div className="px-4 sm:px-6 py-3 sm:py-4">{children}</div>
        {onClose && !showCloseButton && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
