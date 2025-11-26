import { Game, Guess } from '@prisma/client';

export interface GameWithGuesses extends Game {
  guesses: Guess[];
}

export interface CreateGameDto {
  userId?: string;
  gameMode?: string;
  word?: string;
}

export interface UpdateGameDto {
  status?: 'playing' | 'won' | 'lost';
  attempts?: number;
}

export interface GuessFeedback {
  letter: string;
  position: number;
  status: 'correct' | 'present' | 'absent';
}

