import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/sync', requireAuth, authController.syncUser.bind(authController));

export default router;
