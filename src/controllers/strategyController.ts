import { Request, Response } from 'express';
import { saveStrategy, loadStrategies } from '../services/storageService';

export const getStrategies = async (req: Request, res: Response) => {
  try {
    const strategies = await loadStrategies();
    res.json(strategies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createStrategy = async (req: Request, res: Response) => {
  try {
    const { name, rules } = req.body;
    if (!name || !rules) {
      return res.status(400).json({ error: 'Name and rules are required' });
    }
    const strategy = await saveStrategy({ name, rules });
    res.json(strategy);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
