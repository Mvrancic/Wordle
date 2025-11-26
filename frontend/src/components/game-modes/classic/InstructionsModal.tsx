import React from 'react';
import { Modal } from '../../ui/Modal';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cómo jugar">
      <div className="space-y-4 sm:space-y-6 text-gray-300 text-sm sm:text-base">
        <p>
          Adivina la palabra oculta en 6 intentos.
        </p>
        <p>
          Cada intento debe ser una palabra válida de 5 letras. No puedes ingresar letras aleatorias. Presiona el botón Enter para enviar tu intento.
        </p>
        <p>
          Después de tu envío, el color de las casillas cambiará como en los ejemplos de abajo.
        </p>

        <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-700">
          <h3 className="text-white font-semibold text-base sm:text-lg">Ejemplos</h3>
          
          {/* Ejemplo 1 - Verde (G en GAMES) */}
          <div className="space-y-2">
            <div className="flex gap-1.5 sm:gap-2 justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-wordle-correct rounded border-2 border-wordle-correct flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                G
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                A
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                M
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                E
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                S
              </div>
            </div>
            <p className="text-sm">
              La letra <strong className="text-wordle-correct">G</strong> está en la palabra y en la posición correcta.
            </p>
          </div>

          {/* Ejemplo 2 - Amarillo (O en HOTEL) */}
          <div className="space-y-2">
            <div className="flex gap-1.5 sm:gap-2 justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                H
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded border-2 border-yellow-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                O
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                T
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                E
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                L
              </div>
            </div>
            <p className="text-sm">
              La letra <strong className="text-yellow-500">O</strong> está en la palabra pero en la posición incorrecta.
            </p>
          </div>

          {/* Ejemplo 3 - Gris (segunda C en CLICK) */}
          <div className="space-y-2">
            <div className="flex gap-1.5 sm:gap-2 justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                C
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                L
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded border-2 border-gray-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                I
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                C
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                K
              </div>
            </div>
            <p className="text-sm">
              La letra <strong className="text-gray-400">I</strong> no está en la palabra en ninguna posición.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
