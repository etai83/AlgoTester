import fs from 'fs/promises';
import { OHLCV } from '../types/ohlcv';

export async function parseCsv(filePath: string): Promise<OHLCV[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) return [];

    // Check header to determine format
    const header = lines[0]!.toLowerCase();
    // yfinance format often has "Datetime" as the first column
    const isYFinance = header.includes('datetime');
    
    const dataLines = lines.slice(1);
    
    const parsedData: OHLCV[] = [];

    for (const line of dataLines) {
      // Remove any carriage returns
      const cleanLine = line.replace('\r', '');
      if (!cleanLine) continue;

      const parts = cleanLine.split(',');
      if (parts.length < 6) continue;
      
      let timestamp: number;
      let open: number;
      let high: number;
      let low: number;
      let close: number;
      let volume: number;

      if (isYFinance) {
        // Format: Datetime, Close, High, Low, Open, Volume
        // Index:  0,        1,     2,    3,   4,    5
        timestamp = new Date(parts[0]!).getTime();
        close = parseFloat(parts[1]!);
        high = parseFloat(parts[2]!);
        low = parseFloat(parts[3]!);
        open = parseFloat(parts[4]!);
        volume = parseFloat(parts[5]!);
      } else {
        // Standard Format: timestamp, open, high, low, close, volume
        // Index:           0,         1,    2,    3,   4,     5
        timestamp = parseFloat(parts[0]!);
        open = parseFloat(parts[1]!);
        high = parseFloat(parts[2]!);
        low = parseFloat(parts[3]!);
        close = parseFloat(parts[4]!);
        volume = parseFloat(parts[5]!);
      }
      
      if (
        !isNaN(timestamp) &&
        !isNaN(open) &&
        !isNaN(high) &&
        !isNaN(low) &&
        !isNaN(close) &&
        !isNaN(volume)
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
