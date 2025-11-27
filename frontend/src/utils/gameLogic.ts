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

