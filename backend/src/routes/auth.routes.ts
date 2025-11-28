import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

router.post('/sync', authController.syncUser.bind(authController));

export default router;

