import { Request, Response } from 'express';
import path from 'path';
import { parseCsv } from '../utils/csvParser';
import { runBacktest } from '../utils/simulator';
import { calculateIndicators } from '../utils/indicators';
import { BacktestRequest } from '../types/backtest';
import { saveSimulation } from '../services/storageService';

export const executeBacktest = async (req: Request, res: Response) => {
  try {
    let { csvFilePath, rules, initialBalance } = req.body;
    
    // Parse rules if it came as a JSON string (typical with FormData)
    if (typeof rules === 'string') {
        try {
            rules = JSON.parse(rules);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid rules format' });
        }
    }

    if (req.file) {
        csvFilePath = req.file.path;
    }

    let fileName = 'Unknown';
    if (req.file) {
        fileName = req.file.originalname;
    } else if (csvFilePath) {
        fileName = path.basename(csvFilePath);
    }

    if (!csvFilePath) {
      return res.status(400).json({ error: 'csvFilePath or file upload is required' });
    }

    if (!rules || !rules.entry || !rules.exit) {
        return res.status(400).json({ error: 'Valid entry and exit rules are required' });
    }

    let candles = await parseCsv(csvFilePath);
    if (candles.length === 0) {
        return res.status(400).json({ error: 'No data found in CSV file' });
    }

    // Enrich with indicators
    candles = calculateIndicators(candles);

    // Pass default commission if not provided
    const initBalance = Number(initialBalance) || 10000;
    const result = runBacktest(candles, rules, initBalance, 0.001);
    
    // Save to history
    await saveSimulation(result, rules, initBalance, fileName);

    res.json(result);
  } catch (error: any) {
    console.error('Backtest error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const previewData = async (req: Request, res: Response) => {
  try {
    let csvFilePath: string | undefined;

    if (req.file) {
      csvFilePath = req.file.path;
    }

    if (!csvFilePath) {
      return res.status(400).json({ error: 'File upload is required' });
    }

    const candles = await parseCsv(csvFilePath);
    if (candles.length === 0) {
      return res.status(400).json({ error: 'No data found in CSV file' });
    }

    // Return only necessary data for plotting
    const preview = candles.map(c => ({
      timestamp: c.timestamp,
      close: c.close
    }));

    res.json(preview);
  } catch (error: any) {
    console.error('Preview error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
