import pool from '../config/database';
import { User } from '../models/user.model';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const result = await pool.query(
        `SELECT 
          id,
          email,
          username,
          password,
          created_at as "createdAt",
          updated_at as "updatedAt"
         FROM users WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[UserRepository] Error finding user by id ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await pool.query(
        `SELECT 
          id,
          email,
          username,
          password,
          created_at as "createdAt",
          updated_at as "updatedAt"
         FROM users WHERE email = $1`,
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[UserRepository] Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  async create(email: string, username: string | undefined, hashedPassword: string): Promise<User> {
    try {
      const result = await pool.query(
        `INSERT INTO users (email, username, password) 
         VALUES ($1, $2, $3) 
         RETURNING 
          id,
          email,
          username,
          password,
          created_at as "createdAt",
          updated_at as "updatedAt"`,
        [email, username, hashedPassword]
      );
      return result.rows[0];
    } catch (error) {
      console.error('[UserRepository] Error creating user:', error);
      throw error;
    }
  }
}

export default new UserRepository();

