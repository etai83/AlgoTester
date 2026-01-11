import { Router } from 'express';
import { getHistory, getLatestHistoryItem, getHistoryItemById } from '../controllers/historyController';

const router = Router();

router.get('/latest', getLatestHistoryItem);
router.get('/:id', getHistoryItemById);
router.get('/', getHistory);

export default router;
