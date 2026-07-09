import { Request, Response } from 'express';
import statsService from '../services/stats.service';
import { ApiResponse } from '../types';

export class StatsController {
  async getStats(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const userId = req.userId!;

      if (req.params.userId !== userId) {
        res.status(403).json({ success: false, error: 'Forbidden' });
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
      const userId = req.userId!;
      const { mode, targetWord, won, attemptsUsed, timeLimit, timeTaken } = req.body;

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
        timeLimit,
        timeTaken,
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
}

export default new StatsController();
