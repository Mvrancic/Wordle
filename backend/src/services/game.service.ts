import gameRepository from '../repositories/game.repository';
import { CreateGameDto, UpdateGameDto, GuessFeedback } from '../models/game.model';

// Simple word list for now - in production, this would come from a database
const WORDS = [
  'WORLD', 'HELLO', 'WORDS', 'GAMES', 'QUICK', 'BROWN', 'FOXES', 'JUMPS',
  'LAZER', 'CLOUD', 'MUSIC', 'DANCE', 'LIGHT', 'DARK', 'PEACE', 'LOVE',
  'HAPPY', 'SMILE', 'OCEAN', 'BEACH', 'MOUNT', 'RIVER', 'FOREST', 'TREES'
];

export class GameService {
  async createGame(data: CreateGameDto) {
    // Select a random word
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    
    return gameRepository.create({
      ...data,
      word: randomWord.toUpperCase(),
    });
  }

  async getGameById(id: string) {
    const game = await gameRepository.findById(id);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  async makeGuess(gameId: string, guessWord: string) {
    const game = await this.getGameById(gameId);

    if (game.status !== 'playing') {
      throw new Error('Game is not active');
    }

    if (game.attempts >= game.maxAttempts) {
      throw new Error('Maximum attempts reached');
    }

    const upperGuess = guessWord.toUpperCase();
    const upperWord = game.word.toUpperCase();

    // Generate feedback
    const feedback = this.generateFeedback(upperGuess, upperWord);
    const attemptNumber = game.attempts + 1;

    // Create guess record
    await gameRepository.createGuess(
      gameId,
      upperGuess,
      JSON.stringify(feedback),
      attemptNumber
    );

    // Check if won
    const isWon = upperGuess === upperWord;
    const newAttempts = attemptNumber;
    const newStatus = isWon ? 'won' : (newAttempts >= game.maxAttempts ? 'lost' : 'playing');

    // Update game
    const updatedGame = await gameRepository.update(gameId, {
      attempts: newAttempts,
      status: newStatus,
    });

    return {
      game: updatedGame,
      feedback,
      isWon,
      isGameOver: newStatus !== 'playing',
    };
  }

  private generateFeedback(guess: string, word: string): GuessFeedback[] {
    const feedback: GuessFeedback[] = [];
    const wordLetters = word.split('');
    const guessLetters = guess.split('');
    const usedIndices = new Set<number>();

    // First pass: mark correct letters
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === wordLetters[i]) {
        feedback[i] = {
          letter: guessLetters[i],
          position: i,
          status: 'correct',
        };
        usedIndices.add(i);
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
      if (!feedback[i]) {
        const letterIndex = wordLetters.findIndex(
          (letter, idx) => letter === guessLetters[i] && !usedIndices.has(idx)
        );
        if (letterIndex !== -1) {
          feedback[i] = {
            letter: guessLetters[i],
            position: i,
            status: 'present',
          };
          usedIndices.add(letterIndex);
        } else {
          feedback[i] = {
            letter: guessLetters[i],
            position: i,
            status: 'absent',
          };
        }
      }
    }

    return feedback;
  }
}

export default new GameService();

