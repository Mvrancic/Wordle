import { Router } from 'express';
import historyController from '../controllers/history.controller';

const router = Router();

router.get('/:userId', historyController.getHistory.bind(historyController));

export default router;

