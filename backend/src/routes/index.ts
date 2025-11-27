import { Router } from 'express';
import gameRoutes from './game.routes';
import wordRoutes from './word.routes';

const router = Router();

router.use('/games', gameRoutes);
router.use('/words', wordRoutes);

export default router;
