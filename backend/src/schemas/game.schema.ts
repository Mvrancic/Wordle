import { z } from 'zod';

export const createGameSchema = z.object({
  gameMode: z.enum(['classic', 'timer', 'accented', 'movies']).optional().default('classic'),
  userId: z.string().uuid().optional(),
});

export const makeGuessSchema = z.object({
  word: z.string().length(5).regex(/^[a-zA-Z]+$/),
});

export const updateGameSchema = z.object({
  status: z.enum(['playing', 'won', 'lost']).optional(),
  attempts: z.number().int().min(0).max(6).optional(),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type MakeGuessInput = z.infer<typeof makeGuessSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;

