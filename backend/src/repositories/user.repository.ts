import pool from '../config/database';
import { User } from '../models/user.model';
import { logger } from '../utils/logger';

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
      logger.error(`Error finding user by id ${id}`, error);
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
      logger.error(`Error finding user by email ${email}`, error);
      throw error;
    }
  }

  async create(email: string, username: string | undefined, hashedPassword: string, userId?: string): Promise<User> {
    try {
      const finalUserId = userId || require('uuid').v4();
      
      const result = await pool.query(
        `INSERT INTO users (id, email, username, password) 
         VALUES ($1, $2, $3, $4) 
         RETURNING 
          id,
          email,
          username,
          password,
          created_at as "createdAt",
          updated_at as "updatedAt"`,
        [finalUserId, email, username, hashedPassword]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating user', error);
      throw error;
    }
  }
}

export default new UserRepository();

