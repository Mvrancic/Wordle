import prisma from '../config/database';
import { Game, Guess } from '@prisma/client';
import {
  CreateGameDto,
  UpdateGameDto,
  GameWithGuesses,
} from '../models/game.model';

export class GameRepository {
  async create(data: CreateGameDto & { wordId: string }): Promise<Game> {
    return prisma.game.create({
      data: {
        userId: data.userId,
        gameMode: data.gameMode || 'classic',
        wordId: data.wordId,
      },
    });
  }

  async findById(id: string): Promise<GameWithGuesses | null> {
    return prisma.game.findUnique({
      where: { id },
      include: {
        guesses: { orderBy: { attemptNumber: 'asc' } },
        word: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Game[]> {
    return prisma.game.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { guesses: true },
    });
  }

  async update(id: string, data: UpdateGameDto): Promise<Game> {
    return prisma.game.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.game.delete({ where: { id } });
  }

  async createGuess(
    gameId: string,
    word: string,
    feedback: string,
    attemptNumber: number
  ): Promise<Guess> {
    return prisma.guess.create({
      data: {
        gameId,
        word,
        feedback,
        attemptNumber,
      },
    });
  }
}

export default new GameRepository();
