import { Router } from 'express';
import statsRoutes from './stats.routes';
import historyRoutes from './history.routes';
import settingsRoutes from './settings.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stats', statsRoutes);
router.use('/history', historyRoutes);
router.use('/settings', settingsRoutes);

export default router;
