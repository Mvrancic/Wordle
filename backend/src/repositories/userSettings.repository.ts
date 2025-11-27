import pool from '../config/database';
import { UserSettings } from '../models/user.model';

export class UserSettingsRepository {
  async findByUserId(userId: string): Promise<UserSettings | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM user_settings WHERE user_id = $1',
        [userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[UserSettingsRepository] Error finding settings for user ${userId}:`, error);
      throw error;
    }
  }

  async create(userId: string): Promise<UserSettings> {
    try {
      const result = await pool.query(
        `INSERT INTO user_settings (user_id, theme, language, animations, hard_mode_default)
         VALUES ($1, 'system', 'en', true, false)
         RETURNING 
          user_id as "userId",
          theme,
          language,
          animations,
          hard_mode_default as "hardModeDefault",
          created_at as "createdAt",
          updated_at as "updatedAt"`,
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`[UserSettingsRepository] Error creating settings for user ${userId}:`, error);
      throw error;
    }
  }

  async update(
    userId: string,
    updates: {
      theme?: 'light' | 'dark' | 'system';
      language?: 'en' | 'es';
      animations?: boolean;
      hardModeDefault?: boolean;
    }
  ): Promise<UserSettings> {
    try {
      const updatesList: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      if (updates.theme !== undefined) {
        updatesList.push(`theme = $${paramIndex++}`);
        values.push(updates.theme);
      }
      if (updates.language !== undefined) {
        updatesList.push(`language = $${paramIndex++}`);
        values.push(updates.language);
      }
      if (updates.animations !== undefined) {
        updatesList.push(`animations = $${paramIndex++}`);
        values.push(updates.animations);
      }
      if (updates.hardModeDefault !== undefined) {
        updatesList.push(`hard_mode_default = $${paramIndex++}`);
        values.push(updates.hardModeDefault);
      }

      if (updatesList.length === 0) {
        const settings = await this.findByUserId(userId);
        if (!settings) {
          throw new Error('Settings not found');
        }
        return settings;
      }

      values.push(userId);
      const result = await pool.query(
        `UPDATE user_settings
         SET ${updatesList.join(', ')}, updated_at = NOW()
         WHERE user_id = $${paramIndex}
         RETURNING 
          user_id as "userId",
          theme,
          language,
          animations,
          hard_mode_default as "hardModeDefault",
          created_at as "createdAt",
          updated_at as "updatedAt"`,
        values
      );

      if (result.rows.length === 0) {
        throw new Error('Settings not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error(`[UserSettingsRepository] Error updating settings for user ${userId}:`, error);
      throw error;
    }
  }
}

export default new UserSettingsRepository();

