import { Router } from 'express';
import wordController from '../controllers/word.controller';

const router = Router();

router.get('/random', wordController.getRandomWord.bind(wordController));
router.get('/validate/:word', wordController.validateWord.bind(wordController));

export default router;

