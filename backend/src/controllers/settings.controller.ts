import { Request, Response } from 'express';
import settingsService from '../services/settings.service';
import { ApiResponse } from '../types';

export class SettingsController {
  async getSettings(req: Request, res: Response<ApiResponse>): Promise<void> {
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

      const settings = await settingsService.getSettings(userId);

      res.json({
        success: true,
        data: settings,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get settings';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async updateSettings(req: Request, res: Response<ApiResponse>): Promise<void> {
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

      const updates = req.body;
      const settings = await settingsService.updateSettings(userId, updates);

      res.json({
        success: true,
        data: settings,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update settings';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}

export default new SettingsController();

