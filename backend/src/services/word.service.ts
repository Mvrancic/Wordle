import gamemodewordRepository from '../repositories/gamemodeword.repository';
import gamemodeRepository from '../repositories/gamemode.repository';

export class WordService {
  async getRandomWord(_gameModeName: string = 'classic'): Promise<string> {
    // Todos los modos usan las palabras del modo "classic"
    const classicMode = await gamemodeRepository.findByName('classic');
    if (!classicMode) {
      throw new Error('Classic game mode not found');
    }

    const gameModeWord = await gamemodewordRepository.findRandom(classicMode.id);
    if (!gameModeWord) {
      throw new Error('No words available for classic game mode');
    }
    return gameModeWord.word;
  }

  async validateWord(_gameModeName: string, word: string): Promise<boolean> {
    // Todos los modos validan contra las palabras del modo "classic"
    const classicMode = await gamemodeRepository.findByName('classic');
    if (!classicMode) {
      return false;
    }
    return gamemodewordRepository.exists(classicMode.id, word);
  }

  async getAllWords(_gameModeName: string = 'classic'): Promise<string[]> {
    // Todos los modos usan las palabras del modo "classic"
    const classicMode = await gamemodeRepository.findByName('classic');
    if (!classicMode) {
      throw new Error('Classic game mode not found');
    }
    return gamemodewordRepository.findAllWords(classicMode.id);
  }

  async seedWords(
    gameModeName: string,
    words: string[],
    language: string = 'es'
  ): Promise<void> {
    let gameMode = await gamemodeRepository.findByName(gameModeName);
    if (!gameMode) {
      gameMode = await gamemodeRepository.create(gameModeName);
    }
    await gamemodewordRepository.createMany(gameMode.id, words, language);
  }
}

export default new WordService();

