import pool from '../config/database';


export class DailyWordRepository {
  /**
   * Get Argentina timezone date (today at 00:00 Argentina time)
   * Returns date as string in format YYYY-MM-DD for database comparison
   */
  private getArgentinaTodayDate(): string {
    // Get current time in Argentina timezone
    const now = new Date();
    const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    
    // Format as YYYY-MM-DD
    const year = argentinaTime.getFullYear();
    const month = String(argentinaTime.getMonth() + 1).padStart(2, '0');
    const day = String(argentinaTime.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Get today's daily word (based on Argentina timezone)
   */
  async getTodayWord(): Promise<string | null> {
    const today = this.getArgentinaTodayDate();
    
    try {
      const result = await pool.query(
        `SELECT word FROM daily_words WHERE date = $1::date`,
        [today]
      );

      if (result.rows.length > 0) {
        return result.rows[0].word;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all daily words used so far
   */
  async getAllDailyWords(): Promise<string[]> {
    const result = await pool.query(
      `SELECT word FROM daily_words ORDER BY date DESC`
    );

    return result.rows.map((row: { word: string }) => row.word.toUpperCase());
  }

  /**
   * Set today's daily word (based on Argentina timezone)
   */
  async setTodayWord(word: string): Promise<void> {
    const today = this.getArgentinaTodayDate();

    try {
      await pool.query(
        `INSERT INTO daily_words (id, word, date, created_at)
         VALUES (gen_random_uuid(), $1, $2::date, NOW())
         ON CONFLICT (date) DO UPDATE SET word = $1`,
        [word.toUpperCase(), today]
      );
    } catch (error) {
      // Si hay error de constraint único, intentar con UPDATE
      try {
        await pool.query(
          `UPDATE daily_words SET word = $1 WHERE date = $2::date`,
          [word.toUpperCase(), today]
        );
      } catch (updateError) {
        throw updateError;
      }
    }
  }

  /**
   * Check if a word has been used as daily word
   */
  async hasBeenUsed(word: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM daily_words WHERE word = $1`,
      [word.toUpperCase()]
    );

    return parseInt(result.rows[0].count) > 0;
  }
}

export default new DailyWordRepository();


