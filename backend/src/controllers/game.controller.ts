import { Request, Response } from 'express';
import gameService from '../services/game.service';
import { ApiResponse } from '../types';

export class GameController {
  async createGame(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const game = await gameService.createGame({
        userId: undefined, // TODO: Implementar autenticación cuando sea necesario
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
      
      // Log del error completo para debugging
      console.error('[GameController] Error creating game:', error);
      if (error instanceof Error) {
        console.error('[GameController] Error stack:', error.stack);
      }
      
      // Retornar mensaje más específico
      const statusCode = message.includes('not found') || message.includes('No words') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: message,
      });
    }
  }

  async getGame(req: Request, res: Response<ApiResponse>): Promise<void> {
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

  async makeGuess(req: Request, res: Response<ApiResponse>): Promise<void> {
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
