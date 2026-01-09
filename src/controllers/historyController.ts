import { Request, Response } from 'express';
import { loadHistory } from '../services/storageService';

export const getHistory = async (req: Request, res: Response) => {
    try {
        const history = await loadHistory();
        res.json(history);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
