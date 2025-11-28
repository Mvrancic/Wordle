import { Router } from 'express';
import statsController from '../controllers/stats.controller';

const router = Router();

router.get('/:userId', statsController.getStats.bind(statsController));
router.post('/:userId', statsController.updateStats.bind(statsController));
router.post('/record', statsController.recordGame.bind(statsController));

export default router;

