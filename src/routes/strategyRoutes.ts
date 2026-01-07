import { Router } from 'express';
import { getStrategies, createStrategy } from '../controllers/strategyController';

const router = Router();

router.get('/', getStrategies);
router.post('/', createStrategy);

export default router;
