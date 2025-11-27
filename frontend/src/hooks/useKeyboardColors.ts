import { useMemo } from 'react';
import { CellStatus } from '../components/game/board/GameCell';

interface Guess {
  word: string;
  feedback: CellStatus[];
}

type KeyStatus = 'correct' | 'present' | 'absent' | 'none';

export function useKeyboardColors(guesses: Guess[]): Map<string, KeyStatus> {
  return useMemo(() => {
    const keyColors = new Map<string, KeyStatus>();

    // Procesar todos los intentos
    guesses.forEach((guess) => {
      guess.word.split('').forEach((letter, index) => {
        const status = guess.feedback[index];
        const currentStatus = keyColors.get(letter) || 'none';

        // La jerarquía es: correct > present > absent
        if (status === 'correct') {
          keyColors.set(letter, 'correct');
        } else if (status === 'present' && currentStatus !== 'correct') {
          keyColors.set(letter, 'present');
        } else if (
          status === 'absent' &&
          currentStatus !== 'correct' &&
          currentStatus !== 'present'
        ) {
          keyColors.set(letter, 'absent');
        }
      });
    });

    return keyColors;
  }, [guesses]);
}

