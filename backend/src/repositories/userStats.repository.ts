import pool from '../config/database';
import { UserStats } from '../models/user.model';

export class UserStatsRepository {
  async findByUserId(userId: string): Promise<UserStats | null> {
    try {
      const result = await pool.query(
        `SELECT 
          user_id as "userId",
          games_played as "gamesPlayed",
          games_won as "gamesWon",
          win_rate as "winRate",
          current_streak as "currentStreak",
          max_streak as "maxStreak",
          avg_attempts as "avgAttempts",
          last_played_at as "lastPlayedAt",
          created_at as "createdAt",
          updated_at as "updatedAt"
         FROM user_stats WHERE user_id = $1`,
        [userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[UserStatsRepository] Error finding stats for user ${userId}:`, error);
      throw error;
    }
  }

  async create(userId: string): Promise<UserStats> {
    try {
      const result = await pool.query(
        `INSERT INTO user_stats (user_id, games_played, games_won, win_rate, current_streak, max_streak, avg_attempts)
         VALUES ($1, 0, 0, 0.0, 0, 0, 0.0)
         RETURNING 
          user_id as "userId",
          games_played as "gamesPlayed",
          games_won as "gamesWon",
          win_rate as "winRate",
          current_streak as "currentStreak",
          max_streak as "maxStreak",
          avg_attempts as "avgAttempts",
          last_played_at as "lastPlayedAt",
          created_at as "createdAt",
          updated_at as "updatedAt"`,
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[UserStatsRepository] Error creating stats for user ${userId}:`, error);
      throw error;
    }
  }

  async updateAfterGame(
    userId: string,
    won: boolean,
    attemptsUsed: number
  ): Promise<UserStats> {
    try {
      // Usar la función helper de PostgreSQL
      await pool.query(
        'SELECT update_user_stats_after_game($1, $2, $3)',
        [userId, won, attemptsUsed]
      );
      
      // Obtener las estadísticas actualizadas
      const stats = await this.findByUserId(userId);
      if (!stats) {
        throw new Error('Stats not found after update');
      }
      return stats;
    } catch (error) {
      console.error(`[UserStatsRepository] Error updating stats for user ${userId}:`, error);
      throw error;
    }
  }
}

export default new UserStatsRepository();

