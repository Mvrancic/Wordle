import pool from '../config/database';
import { Game, Guess, GameWithGuesses } from '../models/game.model';
import {
  CreateGameDto,
  UpdateGameDto,
} from '../models/game.model';

export class GameRepository {
  async create(
    data: CreateGameDto & { gameModeId: string; targetWord: string }
  ): Promise<Game> {
    const result = await pool.query(
      `INSERT INTO games (user_id, game_mode_id, target_word, max_attempts, status, attempts)
       VALUES ($1, $2, $3, $4, 'playing', 0)
       RETURNING *`,
      [data.userId || null, data.gameModeId, data.targetWord, data.maxAttempts || 6]
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<GameWithGuesses | null> {
    // Obtener el juego
    const gameResult = await pool.query(
      'SELECT * FROM games WHERE id = $1',
      [id]
    );
    
    if (gameResult.rows.length === 0) {
      return null;
    }

    const game = gameResult.rows[0];

    // Obtener los intentos
    const guessesResult = await pool.query(
      'SELECT * FROM guesses WHERE game_id = $1 ORDER BY attempt_number ASC',
      [id]
    );

    // Obtener el modo de juego
    const gameModeResult = await pool.query(
      'SELECT * FROM game_modes WHERE id = $1',
      [game.game_mode_id]
    );

    return {
      ...game,
      userId: game.user_id,
      gameModeId: game.game_mode_id,
      targetWord: game.target_word,
      maxAttempts: game.max_attempts,
      createdAt: game.created_at,
      updatedAt: game.updated_at,
      guesses: guessesResult.rows.map(g => ({
        ...g,
        gameId: g.game_id,
        attemptNumber: g.attempt_number,
        createdAt: g.created_at,
      })),
      gameMode: gameModeResult.rows[0] || null,
    };
  }

  async findByUserId(userId: string): Promise<Game[]> {
    const result = await pool.query(
      'SELECT * FROM games WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(game => ({
      ...game,
      userId: game.user_id,
      gameModeId: game.game_mode_id,
      targetWord: game.target_word,
      maxAttempts: game.max_attempts,
      createdAt: game.created_at,
      updatedAt: game.updated_at,
    }));
  }

  async update(id: string, data: UpdateGameDto): Promise<Game> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (data.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.attempts !== undefined) {
      updates.push(`attempts = $${paramCount++}`);
      values.push(data.attempts);
    }

    if (updates.length === 0) {
      const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
      return result.rows[0];
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE games SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM games WHERE id = $1', [id]);
  }

  async createGuess(
    gameId: string,
    word: string,
    feedback: string,
    attemptNumber: number
  ): Promise<Guess> {
    const result = await pool.query(
      `INSERT INTO guesses (game_id, word, feedback, attempt_number)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [gameId, word, feedback, attemptNumber]
    );
    const g = result.rows[0];
    return {
      ...g,
      gameId: g.game_id,
      attemptNumber: g.attempt_number,
      createdAt: g.created_at,
    };
  }
}

export default new GameRepository();
