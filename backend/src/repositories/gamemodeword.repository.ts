import pool from '../config/database';
import { GameModeWord } from '../models/game.model';

export class GameModeWordRepository {
  async findRandom(gameModeId: string): Promise<GameModeWord | null> {
    try {
      // Método optimizado: usar TABLESAMPLE para mejor rendimiento con muchas palabras
      // Si TABLESAMPLE no está disponible, usar RANDOM() con LIMIT (más rápido que OFFSET)
      const result = await pool.query(
        `SELECT * FROM game_mode_words 
         WHERE game_mode_id = $1 
         ORDER BY RANDOM() 
         LIMIT 1`,
        [gameModeId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[GameModeWordRepository] Error finding random word for game mode ${gameModeId}:`, error);
      throw error;
    }
  }

  async findByWord(gameModeId: string, word: string): Promise<GameModeWord | null> {
    try {
      // Query optimizada: usar el índice compuesto (game_mode_id, word)
      const result = await pool.query(
        'SELECT * FROM game_mode_words WHERE game_mode_id = $1 AND word = $2 LIMIT 1',
        [gameModeId, word.toUpperCase()]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[GameModeWordRepository] Error finding word:`, error);
      throw error;
    }
  }

  async exists(gameModeId: string, word: string): Promise<boolean> {
    // Usar EXISTS directamente en SQL para mejor rendimiento
    try {
      const result = await pool.query(
        'SELECT EXISTS(SELECT 1 FROM game_mode_words WHERE game_mode_id = $1 AND word = $2) as exists',
        [gameModeId, word.toUpperCase()]
      );
      return result.rows[0].exists;
    } catch (error) {
      console.error(`[GameModeWordRepository] Error checking word existence:`, error);
      return false;
    }
  }

  async create(
    gameModeId: string,
    word: string,
    language: string = 'es'
  ): Promise<GameModeWord> {
    const result = await pool.query(
      `INSERT INTO game_mode_words (game_mode_id, word, length, language)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [gameModeId, word.toUpperCase(), word.length, language]
    );
    return result.rows[0];
  }

  async createMany(
    gameModeId: string,
    words: string[],
    language: string = 'es'
  ): Promise<void> {
    // Usar transacción para insertar múltiples palabras
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const word of words) {
        await client.query(
          `INSERT INTO game_mode_words (game_mode_id, word, length, language)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (game_mode_id, word) DO NOTHING`,
          [gameModeId, word.toUpperCase(), word.length, language]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAllWords(gameModeId: string): Promise<string[]> {
    try {
      // Query optimizada: solo seleccionar la columna word (más rápido que SELECT *)
      const result = await pool.query(
        'SELECT word FROM game_mode_words WHERE game_mode_id = $1 ORDER BY word',
        [gameModeId]
      );
      return result.rows.map(row => row.word);
    } catch (error) {
      console.error(`[GameModeWordRepository] Error finding all words for game mode ${gameModeId}:`, error);
      throw error;
    }
  }
}

export default new GameModeWordRepository();
