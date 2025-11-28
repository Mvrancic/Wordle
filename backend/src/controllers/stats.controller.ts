import { Request, Response } from 'express';
import statsService from '../services/stats.service';
import { ApiResponse } from '../types';

export class StatsController {
  async getStats(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      // TODO: Use req.user?.id when authentication is implemented
      const userId = req.params.userId;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const stats = await statsService.getStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get stats';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async recordGame(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      // TODO: Use req.user?.id when authentication is implemented
      const userId = req.body.userId || req.params.userId;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const { mode, targetWord, won, attemptsUsed } = req.body;

      if (!mode || !targetWord || typeof won !== 'boolean' || !attemptsUsed) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: mode, targetWord, won, attemptsUsed',
        });
        return;
      }

      const stats = await statsService.recordGame({
        userId,
        mode,
        targetWord,
        won,
        attemptsUsed,
      });

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to record game';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async updateStats(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const userId = req.params.userId || req.body.userId;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const { mode, targetWord, won, attemptsUsed } = req.body;

      if (!mode || !targetWord || typeof won !== 'boolean' || !attemptsUsed) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: mode, targetWord, won, attemptsUsed',
        });
        return;
      }

      const stats = await statsService.recordGame({
        userId,
        mode,
        targetWord,
        won,
        attemptsUsed,
      });

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update stats';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}

export default new StatsController();

