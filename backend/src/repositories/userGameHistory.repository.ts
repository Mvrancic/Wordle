import pool from '../config/database';
import { UserGameHistory } from '../models/user.model';
import { logger } from '../utils/logger';

export class UserGameHistoryRepository {
  async create(
    userId: string,
    mode: string,
    targetWord: string,
    won: boolean,
    attemptsUsed: number,
    timeLimit?: number,
    timeTaken?: number
  ): Promise<UserGameHistory> {
    try {
      const result = await pool.query(
        `INSERT INTO user_game_history (user_id, mode, target_word, won, attempts_used, time_limit, time_taken)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, mode, targetWord.toUpperCase(), won, attemptsUsed, timeLimit || null, timeTaken || null]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating game history', error);
      throw error;
    }
  }

  async findByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<UserGameHistory[]> {
    try {
      const result = await pool.query(
        `SELECT 
          id,
          user_id as "userId",
          mode,
          target_word as "targetWord",
          won,
          attempts_used as "attemptsUsed",
          time_limit as "timeLimit",
          time_taken as "timeTaken",
          played_at as "playedAt",
          created_at as "createdAt"
         FROM user_game_history
         WHERE user_id = $1
         ORDER BY played_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      return result.rows;
    } catch (error) {
      logger.error(`Error finding history for user ${userId}`, error);
      throw error;
    }
  }

  async countByUserId(userId: string): Promise<number> {
    try {
      const result = await pool.query(
        'SELECT COUNT(*) FROM user_game_history WHERE user_id = $1',
        [userId]
      );
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      logger.error(`Error counting history for user ${userId}`, error);
      throw error;
    }
  }
}

export default new UserGameHistoryRepository();

