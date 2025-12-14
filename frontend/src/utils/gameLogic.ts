import { CellStatus } from '../components/game/board/GameCell';

/**
 * Evaluates a guess against the target word using optimized O(n) algorithm
 * Uses letter counting (like official Wordle) instead of .includes() in loops
 */
export function evaluateGuess(guess: string, answer: string): CellStatus[] {
  const result: CellStatus[] = ['absent', 'absent', 'absent', 'absent', 'absent'];
  const guessArr = guess.toUpperCase().split('');
  const answerArr = answer.toUpperCase().split('');
  
  // Count letters in answer (excluding those already matched)
  const answerLetterCounts = new Map<string, number>();
  for (let i = 0; i < 5; i++) {
    const letter = answerArr[i];
    answerLetterCounts.set(letter, (answerLetterCounts.get(letter) || 0) + 1);
  }
  
  // First pass: mark correct letters (green)
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = 'correct';
      // Decrement count for this letter
      answerLetterCounts.set(answerArr[i], (answerLetterCounts.get(answerArr[i]) || 0) - 1);
      // Mark as processed
      guessArr[i] = '';
      answerArr[i] = '';
    }
  }
  
  // Second pass: mark present letters (yellow) using remaining counts
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] !== '' && answerLetterCounts.get(guessArr[i])! > 0) {
      result[i] = 'present';
      // Decrement count for this letter
      answerLetterCounts.set(guessArr[i], answerLetterCounts.get(guessArr[i])! - 1);
    }
  }
  // Remaining letters are already marked as 'absent' by default
  
  return result;
}

/**
 * Validates if a word exists in the dictionary (O(1) lookup)
 */
export function isValidWord(word: string, dictionary: Set<string>): boolean {
  return dictionary.has(word.toUpperCase());
}

/**
 * Selects a random word from the word list
 */
export function getRandomWord(wordList: string[]): string {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex].toUpperCase();
}

/**
 * Validates a guess against hard mode rules
 * @param guess - The current guess to validate
 * @param previousAttempts - Array of previous attempts with their feedback
 * @returns Object with isValid flag and error message if invalid
 */
export function validateHardMode(
  guess: string,
  previousAttempts: Array<{ word: string; feedback: CellStatus[] }>
): { isValid: boolean; errorMessage?: string } {
  const guessUpper = guess.toUpperCase();
  const guessArr = guessUpper.split('');

  // Track required green positions (letter must be at this position)
  const requiredGreenPositions = new Map<number, string>();
  
  // Track required yellow letters (must be included, but not at specific positions)
  const requiredYellowLetters = new Map<string, Set<number>>(); // letter -> set of positions where it was yellow
  
  // Track all gray letters with their attempt context (for checking against required letters)
  const grayLettersInfo: Array<{ letter: string; attemptWord: string; attemptFeedback: CellStatus[] }> = [];

  // First pass: collect all green and yellow requirements
  for (const attempt of previousAttempts) {
    const word = attempt.word.toUpperCase();
    const feedback = attempt.feedback;

    for (let i = 0; i < 5; i++) {
      const letter = word[i];
      const status = feedback[i];

      if (status === 'correct') {
        // Green: must be at this exact position
        requiredGreenPositions.set(i, letter);
      } else if (status === 'present') {
        // Yellow: must be included, but not at this position
        if (!requiredYellowLetters.has(letter)) {
          requiredYellowLetters.set(letter, new Set());
        }
        requiredYellowLetters.get(letter)!.add(i);
      } else if (status === 'absent') {
        // Store gray letter info for second pass
        grayLettersInfo.push({ letter, attemptWord: word, attemptFeedback: feedback });
      }
    }
  }

  // Second pass: process gray letters
  // A gray letter is forbidden only if:
  // 1. It doesn't appear as green/yellow in the same attempt (letras repetidas)
  // 2. It's not already required from any previous attempt
  const forbiddenGrayLetters = new Set<string>();
  for (let idx = 0; idx < grayLettersInfo.length; idx++) {
    const { letter, attemptWord, attemptFeedback } = grayLettersInfo[idx];
    let isRequired = false;
    
    // Check if this letter appears as green or yellow in the same attempt (letras repetidas)
    for (let j = 0; j < 5; j++) {
      if (attemptWord[j] === letter && (attemptFeedback[j] === 'correct' || attemptFeedback[j] === 'present')) {
        isRequired = true;
        break;
      }
    }
    
    // Check if this letter is already required from any attempt (green or yellow)
    if (!isRequired) {
      // Check if it's required as green in any position
      const greenPositionsArray = Array.from(requiredGreenPositions.values());
      for (let k = 0; k < greenPositionsArray.length; k++) {
        if (greenPositionsArray[k] === letter) {
          isRequired = true;
          break;
        }
      }
      // Check if it's required as yellow
      if (!isRequired && requiredYellowLetters.has(letter)) {
        isRequired = true;
      }
    }
    
    // Only mark as forbidden if it's not required (green/yellow) anywhere
    if (!isRequired) {
      forbiddenGrayLetters.add(letter);
    }
  }

  // Validate green positions
  for (let position = 0; position < 5; position++) {
    if (requiredGreenPositions.has(position)) {
      const requiredLetter = requiredGreenPositions.get(position)!;
      if (guessArr[position] !== requiredLetter) {
        return {
          isValid: false,
          errorMessage: `Must use ${requiredLetter} in position ${position + 1}`,
        };
      }
    }
  }

  // Validate yellow letters (must be included, but not at forbidden positions)
  const yellowLettersArray = Array.from(requiredYellowLetters.keys());
  for (let i = 0; i < yellowLettersArray.length; i++) {
    const letter = yellowLettersArray[i];
    const forbiddenPositions = requiredYellowLetters.get(letter)!;
    if (!guessUpper.includes(letter)) {
      return {
        isValid: false,
        errorMessage: `Must include ${letter}`,
      };
    }
    // Check if it's at a forbidden position
    for (let j = 0; j < 5; j++) {
      if (guessArr[j] === letter && forbiddenPositions.has(j)) {
        return {
          isValid: false,
          errorMessage: `${letter} cannot be in position ${j + 1}`,
        };
      }
    }
  }

  // Validate gray letters (cannot be used)
  const forbiddenGrayLettersArray = Array.from(forbiddenGrayLetters);
  for (let i = 0; i < forbiddenGrayLettersArray.length; i++) {
    const letter = forbiddenGrayLettersArray[i];
    if (guessUpper.includes(letter)) {
      return {
        isValid: false,
        errorMessage: `Cannot use ${letter}`,
      };
    }
  }

  return { isValid: true };
}

