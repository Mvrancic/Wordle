import { Request, Response } from 'express';
import historyService from '../services/history.service';
import { ApiResponse } from '../types';

export class HistoryController {
  async getHistory(req: Request, res: Response<ApiResponse>): Promise<void> {
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

      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 100;

      const result = await historyService.getHistory(userId, page, limit);

      // Return just the history array for simpler frontend consumption
      res.json({
        success: true,
        data: result.history,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get history';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async createHistory(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const userId = req.params.userId || req.body.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const { mode, targetWord, won, attemptsUsed, timeLimit, timeTaken } = req.body;

      if (!mode || !targetWord || typeof won !== 'boolean' || !attemptsUsed) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: mode, targetWord, won, attemptsUsed',
        });
        return;
      }

      const history = await historyService.createHistory({
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
        data: history,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create history';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}

export default new HistoryController();

