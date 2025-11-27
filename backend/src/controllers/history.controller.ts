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
      const limit = parseInt(req.query.limit as string, 10) || 50;

      const result = await historyService.getHistory(userId, page, limit);

      res.json({
        success: true,
        data: result,
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

