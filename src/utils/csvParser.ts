import fs from 'fs/promises';
import { OHLCV } from '../types/ohlcv';

export async function parseCsv(filePath: string): Promise<OHLCV[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    const dataLines = lines.slice(1);
    
    const parsedData: OHLCV[] = [];

    for (const line of dataLines) {
      const parts = line.split(',').map(Number);
      const [timestamp, open, high, low, close, volume] = parts;
      
      if (
        typeof timestamp === 'number' && !isNaN(timestamp) &&
        typeof open === 'number' && !isNaN(open) &&
        typeof high === 'number' && !isNaN(high) &&
        typeof low === 'number' && !isNaN(low) &&
        typeof close === 'number' && !isNaN(close) &&
        typeof volume === 'number' && !isNaN(volume)
      ) {
        parsedData.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume
        });
      }
    }
    return parsedData;
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${(error as Error).message}`);
  }
}
