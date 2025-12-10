import { Router } from 'express';
import dailyWordController from '../controllers/dailyWord.controller';

const router = Router();

router.get('/all', dailyWordController.getAllDailyWords.bind(dailyWordController));
router.post('/today', dailyWordController.getTodayWord.bind(dailyWordController));

export default router;


