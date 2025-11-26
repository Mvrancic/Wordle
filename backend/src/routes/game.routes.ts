import { Router } from 'express';
import gameController from '../controllers/game.controller';
import { validate } from '../middleware/validation.middleware';
import { createGameSchema, makeGuessSchema } from '../schemas/game.schema';

const router = Router();

router.post(
  '/',
  validate(createGameSchema),
  gameController.createGame.bind(gameController)
);
router.get('/:id', gameController.getGame.bind(gameController));
router.post(
  '/:id/guess',
  validate(makeGuessSchema),
  gameController.makeGuess.bind(gameController)
);

export default router;
