import { Request, Response } from 'express';
import { loadHistorySummaries, loadHistoryItem, loadLatestHistory } from '../services/storageService';

export const getHistory = async (req: Request, res: Response) => {
    try {
        const summaries = await loadHistorySummaries();
        res.json(summaries);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getHistoryItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }
        const item = await loadHistoryItem(id);

        if (!item) {
            res.status(404).json({ error: 'History item not found' });
            return;
        }

        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getLatestHistoryItem = async (req: Request, res: Response) => {
    try {
        const latest = await loadLatestHistory();
        res.json(latest);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
