import pool from '../config/database';
import { GameModeWord } from '../models/game.model';

export class GameModeWordRepository {
  async findRandom(gameModeId: string): Promise<GameModeWord | null> {
    // Obtener un conteo total
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM game_mode_words WHERE game_mode_id = $1',
      [gameModeId]
    );
    
    const count = parseInt(countResult.rows[0].count, 10);
    if (count === 0) {
      return null;
    }

    // Seleccionar una fila aleatoria usando OFFSET
    const randomSkip = Math.floor(Math.random() * count);
    const result = await pool.query(
      'SELECT * FROM game_mode_words WHERE game_mode_id = $1 ORDER BY id OFFSET $2 LIMIT 1',
      [gameModeId, randomSkip]
    );
    
    return result.rows[0] || null;
  }

  async findByWord(gameModeId: string, word: string): Promise<GameModeWord | null> {
    const result = await pool.query(
      'SELECT * FROM game_mode_words WHERE game_mode_id = $1 AND word = $2',
      [gameModeId, word.toUpperCase()]
    );
    return result.rows[0] || null;
  }

  async exists(gameModeId: string, word: string): Promise<boolean> {
    const found = await this.findByWord(gameModeId, word);
    return found !== null;
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
}

export default new GameModeWordRepository();
