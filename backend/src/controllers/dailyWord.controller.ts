import { Request, Response } from 'express';
import dailyWordService from '../services/dailyWord.service';
import { ApiResponse } from '../types';

export class DailyWordController {
  /**
   * Get all daily words used so far
   */
  async getAllDailyWords(_req: Request, res: Response<ApiResponse<{ words: string[] }>>): Promise<void> {
    try {
      const words = await dailyWordService.getAllDailyWords();
      
      res.json({
        success: true,
        data: {
          words,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get daily words';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get or set today's daily word
   * If word is provided, it will be saved if no word exists for today
   * Returns the word for today (same for all players)
   */
  async getTodayWord(req: Request, res: Response<ApiResponse<{ word: string; hasPlayed: boolean; todayGame?: { targetWord: string; won: boolean; attemptsUsed: number } | null }>>): Promise<void> {
    try {
      const userId = req.userId;
      const word = req.body.word as string | undefined;
      
      if (!word || typeof word !== 'string' || word.length !== 5) {
        res.status(400).json({
          success: false,
          error: 'Word is required and must be a 5-letter string',
        });
        return;
      }

      const todayWord = await dailyWordService.getOrSetTodayWord(word);
      
      let hasPlayed = false;
      let todayGame = null;

      if (userId) {
        hasPlayed = await dailyWordService.hasPlayedToday(userId);
        
        if (hasPlayed) {
          todayGame = await dailyWordService.getTodayGame(userId);
        }
      }

      res.json({
        success: true,
        data: {
          word: todayWord,
          hasPlayed,
          todayGame,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get daily word';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}

export default new DailyWordController();


