import { Router } from 'express';
import gameRoutes from './game.routes';

const router = Router();

router.use('/games', gameRoutes);

export default router;

