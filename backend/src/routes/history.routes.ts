import { Router } from 'express';
import historyController from '../controllers/history.controller';

const router = Router();

router.get('/:userId', historyController.getHistory.bind(historyController));
router.post('/:userId', historyController.createHistory.bind(historyController));

export default router;

