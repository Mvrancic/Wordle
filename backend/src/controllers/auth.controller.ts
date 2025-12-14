import { Request, Response } from 'express';
import userRepository from '../repositories/user.repository';
import userStatsRepository from '../repositories/userStats.repository';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';

export class AuthController {
  // Sincronizar usuario de Supabase Auth a nuestra tabla users
  async syncUser(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { userId, email, username } = req.body;

      if (!userId || !email) {
        res.status(400).json({
          success: false,
          error: 'User ID and email are required',
        });
        return;
      }

      // Verificar si el usuario ya existe
      let user = await userRepository.findById(userId);

      if (!user) {
        const dummyPassword = `oauth_${userId}_${Date.now()}`;
        
        try {
          user = await userRepository.create(email, username || null, dummyPassword, userId);
          await userStatsRepository.create(userId);
        } catch (error: any) {
          if (error.code === '23505') {
            user = await userRepository.findById(userId);
            if (!user) {
              throw error;
            }
          } else {
            throw error;
          }
        }
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sync user';
      logger.error('Error syncing user', error);
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}

export default new AuthController();

