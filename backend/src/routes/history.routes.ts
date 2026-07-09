import { Router } from 'express';
import historyController from '../controllers/history.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/:userId', historyController.getHistory.bind(historyController));

export default router;
