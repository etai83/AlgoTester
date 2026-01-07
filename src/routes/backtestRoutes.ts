import { Router } from 'express';
import multer from 'multer';
import { executeBacktest } from '../controllers/backtestController';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/run', upload.single('file'), executeBacktest);

export default router;