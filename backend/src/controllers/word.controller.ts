import { Request, Response } from 'express';
import wordService from '../services/word.service';
import { ApiResponse } from '../types';

export class WordController {
  async getRandomWord(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const gameMode = (req.query.gameMode as string) || 'classic';
      const word = await wordService.getRandomWord(gameMode);

      res.json({
        success: true,
        data: { word },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to get random word';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async validateWord(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { word } = req.params;
      const gameMode = (req.query.gameMode as string) || 'classic';

      if (!word || word.length !== 5) {
        res.status(400).json({
          success: false,
          error: 'Word must be 5 letters long',
        });
        return;
      }

      const isValid = await wordService.validateWord(gameMode, word);

      res.json({
        success: true,
        data: { isValid },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to validate word';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async getAllWords(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const gameMode = (req.query.gameMode as string) || 'classic';
      const words = await wordService.getAllWords(gameMode);

      res.json({
        success: true,
        data: { words },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to get words';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}

export default new WordController();

