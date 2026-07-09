import { Request, Response } from 'express';
import historyService from '../services/history.service';
import { ApiResponse } from '../types';

export class HistoryController {
  async getHistory(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const userId = req.userId!;

      if (req.params.userId !== userId) {
        res.status(403).json({ success: false, error: 'Forbidden' });
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
}

export default new HistoryController();
