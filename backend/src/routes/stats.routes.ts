import { Router } from 'express';
import statsController from '../controllers/stats.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/:userId', statsController.getStats.bind(statsController));
router.post('/record', statsController.recordGame.bind(statsController));

export default router;
