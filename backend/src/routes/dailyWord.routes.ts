import { Router } from 'express';
import dailyWordController from '../controllers/dailyWord.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/all', dailyWordController.getAllDailyWords.bind(dailyWordController));
router.post('/today', optionalAuth, dailyWordController.getTodayWord.bind(dailyWordController));

export default router;
