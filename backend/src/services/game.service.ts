import gamemodewordRepository from '../repositories/gamemodeword.repository';
import gamemodeRepository from '../repositories/gamemode.repository';
import gameRepository from '../repositories/game.repository';
import { CreateGameDto, GuessFeedback } from '../models/game.model';

export class GameService {
  async createGame(data: CreateGameDto) {
    try {
      // Get game mode
      const gameModeName = data.gameMode || 'classic';
      const gameMode = await gamemodeRepository.findByName(gameModeName);
      if (!gameMode) {
        throw new Error(`Game mode '${gameModeName}' not found`);
      }

      // Todos los modos usan las palabras del modo "classic"
      const classicMode = await gamemodeRepository.findByName('classic');
      if (!classicMode) {
        throw new Error('Classic game mode not found');
      }

      // Get a random word from the classic mode words
      const gameModeWord = await gamemodewordRepository.findRandom(classicMode.id);
      if (!gameModeWord) {
        throw new Error('No words available for classic game mode');
      }

      return await gameRepository.create({
        ...data,
        gameModeId: gameMode.id,
        targetWord: gameModeWord.word,
      });
    } catch (error) {
      console.error('[GameService] Error in createGame:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create game: Unknown error');
    }
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
    
    // Validar que la palabra existe en el diccionario (usando palabras del modo classic)
    const classicMode = await gamemodeRepository.findByName('classic');
    if (!classicMode) {
      throw new Error('Classic game mode not found');
    }
    
    const wordExists = await gamemodewordRepository.exists(classicMode.id, upperGuess);
    if (!wordExists) {
      throw new Error('Word is not valid');
    }

    const upperWord = game.targetWord.toUpperCase();

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
    const newStatus = isWon
      ? 'won'
      : newAttempts >= game.maxAttempts
        ? 'lost'
        : 'playing';

    // Update game
    await gameRepository.update(gameId, {
      attempts: newAttempts,
      status: newStatus,
    });

    // Fetch updated game with word relation
    const gameWithWord = await gameRepository.findById(gameId);
    if (!gameWithWord) {
      throw new Error('Game not found after update');
    }

    return {
      game: gameWithWord,
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
