import { Router } from 'express';
import statsRoutes from './stats.routes';
import historyRoutes from './history.routes';
import authRoutes from './auth.routes';
import dailyWordRoutes from './dailyWord.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stats', statsRoutes);
router.use('/history', historyRoutes);
router.use('/daily', dailyWordRoutes);

export default router;
