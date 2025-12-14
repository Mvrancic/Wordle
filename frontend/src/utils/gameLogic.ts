import { CellStatus } from '../components/game/board/GameCell';

export function evaluateGuess(guess: string, answer: string): CellStatus[] {
  const result: CellStatus[] = ['absent', 'absent', 'absent', 'absent', 'absent'];
  const guessArr = guess.toUpperCase().split('');
  const answerArr = answer.toUpperCase().split('');
  
  const answerLetterCounts = new Map<string, number>();
  for (let i = 0; i < 5; i++) {
    const letter = answerArr[i];
    answerLetterCounts.set(letter, (answerLetterCounts.get(letter) || 0) + 1);
  }
  
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = 'correct';
      answerLetterCounts.set(answerArr[i], (answerLetterCounts.get(answerArr[i]) || 0) - 1);
      guessArr[i] = '';
      answerArr[i] = '';
    }
  }
  
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] !== '' && answerLetterCounts.get(guessArr[i])! > 0) {
      result[i] = 'present';
      answerLetterCounts.set(guessArr[i], answerLetterCounts.get(guessArr[i])! - 1);
    }
  }
  
  return result;
}

export function isValidWord(word: string, dictionary: Set<string>): boolean {
  return dictionary.has(word.toUpperCase());
}

export function getRandomWord(wordList: string[]): string {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex].toUpperCase();
}

export function validateHardMode(
  guess: string,
  previousAttempts: Array<{ word: string; feedback: CellStatus[] }>
): { isValid: boolean; errorMessage?: string } {
  const guessUpper = guess.toUpperCase();
  const guessArr = guessUpper.split('');

  const requiredGreenPositions = new Map<number, string>();
  const requiredYellowLetters = new Map<string, Set<number>>();
  const grayLettersInfo: Array<{ letter: string; attemptWord: string; attemptFeedback: CellStatus[] }> = [];

  for (const attempt of previousAttempts) {
    const word = attempt.word.toUpperCase();
    const feedback = attempt.feedback;

    for (let i = 0; i < 5; i++) {
      const letter = word[i];
      const status = feedback[i];

      if (status === 'correct') {
        requiredGreenPositions.set(i, letter);
      } else if (status === 'present') {
        if (!requiredYellowLetters.has(letter)) {
          requiredYellowLetters.set(letter, new Set());
        }
        requiredYellowLetters.get(letter)!.add(i);
      } else if (status === 'absent') {
        grayLettersInfo.push({ letter, attemptWord: word, attemptFeedback: feedback });
      }
    }
  }

  const forbiddenGrayLetters = new Set<string>();
  for (let idx = 0; idx < grayLettersInfo.length; idx++) {
    const { letter, attemptWord, attemptFeedback } = grayLettersInfo[idx];
    let isRequired = false;
    
    for (let j = 0; j < 5; j++) {
      if (attemptWord[j] === letter && (attemptFeedback[j] === 'correct' || attemptFeedback[j] === 'present')) {
        isRequired = true;
        break;
      }
    }
    
    if (!isRequired) {
      const greenPositionsArray = Array.from(requiredGreenPositions.values());
      for (let k = 0; k < greenPositionsArray.length; k++) {
        if (greenPositionsArray[k] === letter) {
          isRequired = true;
          break;
        }
      }
      if (!isRequired && requiredYellowLetters.has(letter)) {
        isRequired = true;
      }
    }
    
    if (!isRequired) {
      forbiddenGrayLetters.add(letter);
    }
  }

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
    for (let j = 0; j < 5; j++) {
      if (guessArr[j] === letter && forbiddenPositions.has(j)) {
        return {
          isValid: false,
          errorMessage: `${letter} cannot be in position ${j + 1}`,
        };
      }
    }
  }

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

