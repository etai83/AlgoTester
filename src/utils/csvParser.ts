import fs from 'fs/promises';
import { OHLCV } from '../types/ohlcv';

export async function parseCSV(filePath: string): Promise<OHLCV[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      const [timestamp, open, high, low, close, volume] = line.split(',').map(Number);
      return {
        timestamp,
        open,
        high,
        low,
        close,
        volume
      };
    });
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${(error as Error).message}`);
  }
}
