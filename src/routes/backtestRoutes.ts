import { Router } from 'express';
import multer from 'multer';
import { executeBacktest, previewData } from '../controllers/backtestController';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/run', upload.single('file'), executeBacktest);
router.post('/preview', upload.single('file'), previewData);

export default router;