import { Request, Response } from 'express';
import gameService from '../services/game.service';
import { ApiResponse } from '../types';

export class GameController {
  async createGame(req: Request, res: Response<ApiResponse>) {
    try {
      const game = await gameService.createGame({
        userId: req.user?.id,
        gameMode: req.body.gameMode,
      });

      res.status(201).json({
        success: true,
        data: game,
        message: 'Game created successfully',
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to create game';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async getGame(req: Request, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      const game = await gameService.getGameById(id);

      res.json({
        success: true,
        data: game,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to get game';
      const statusCode = message === 'Game not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: message,
      });
    }
  }

  async makeGuess(req: Request, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      const { word } = req.body;

      const result = await gameService.makeGuess(id, word);

      res.json({
        success: true,
        data: result,
        message: result.isWon
          ? 'Congratulations! You won!'
          : result.isGameOver
            ? 'Game over!'
            : 'Guess recorded',
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to make guess';
      const statusCode =
        message.includes('not found') || message.includes('not active')
          ? 400
          : 500;
      res.status(statusCode).json({
        success: false,
        error: message,
      });
    }
  }
}

export default new GameController();
