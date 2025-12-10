import dailyWordRepository from '../repositories/dailyWord.repository';
import pool from '../config/database';

export class DailyWordService {
  /**
   * Get all daily words used so far
   */
  async getAllDailyWords(): Promise<string[]> {
    return await dailyWordRepository.getAllDailyWords();
  }

  /**
   * Get or set today's daily word
   * If word for today exists, returns it (same for all players)
   * If no word for today exists, saves the provided word and returns it
   */
  async getOrSetTodayWord(word: string): Promise<string> {
    try {
      // Check if today's word exists
      let todayWord = await dailyWordRepository.getTodayWord();

      if (todayWord) {
        return todayWord;
      }

      // No word for today, save the provided word
      await dailyWordRepository.setTodayWord(word);
      
      return word.toUpperCase();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Argentina timezone date string (today at 00:00 Argentina time)
   */
  private getArgentinaTodayDate(): string {
    const now = new Date();
    const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const year = argentinaTime.getFullYear();
    const month = String(argentinaTime.getMonth() + 1).padStart(2, '0');
    const day = String(argentinaTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Check if user has already played today (based on Argentina timezone)
   * Checks if user played at least once today (after 00:00 Argentina time)
   */
  async hasPlayedToday(userId: string): Promise<boolean> {
    const today = this.getArgentinaTodayDate();

    const result = await pool.query(
      `SELECT COUNT(*) as count 
       FROM user_game_history
       WHERE user_id = $1 
       AND mode = 'daily'
       AND DATE(COALESCE(played_at, created_at)) = $2`,
      [userId, today]
    );

    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Get today's game for a user (if they already played)
   * Returns the game history entry for today
   */
  async getTodayGame(userId: string): Promise<{ targetWord: string; won: boolean; attemptsUsed: number } | null> {
    const today = this.getArgentinaTodayDate();

    const result = await pool.query(
      `SELECT 
        target_word as "targetWord",
        won,
        attempts_used as "attemptsUsed"
       FROM user_game_history
       WHERE user_id = $1 
       AND mode = 'daily'
       AND DATE(COALESCE(played_at, created_at)) = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, today]
    );

    if (result.rows.length > 0) {
      return {
        targetWord: result.rows[0].targetWord,
        won: result.rows[0].won,
        attemptsUsed: result.rows[0].attemptsUsed,
      };
    }

    return null;
  }
}

export default new DailyWordService();

