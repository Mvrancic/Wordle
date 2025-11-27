import { Router } from 'express';
import settingsController from '../controllers/settings.controller';

const router = Router();

router.get('/:userId', settingsController.getSettings.bind(settingsController));
router.put('/:userId', settingsController.updateSettings.bind(settingsController));

export default router;

