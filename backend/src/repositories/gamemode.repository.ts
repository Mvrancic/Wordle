import pool from '../config/database';
import { GameMode } from '../models/game.model';

export class GameModeRepository {
  async findByName(name: string): Promise<GameMode | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM game_modes WHERE name = $1',
        [name]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[GameModeRepository] Error finding game mode by name '${name}':`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<GameMode | null> {
    const result = await pool.query(
      'SELECT * FROM game_modes WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(name: string, description?: string): Promise<GameMode> {
    const result = await pool.query(
      'INSERT INTO game_modes (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  }

  async findAll(): Promise<GameMode[]> {
    const result = await pool.query(
      'SELECT * FROM game_modes ORDER BY name ASC'
    );
    return result.rows;
  }
}

export default new GameModeRepository();
