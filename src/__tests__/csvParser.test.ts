import { parseCSV } from '../utils/csvParser';
import path from 'path';

describe('CSV Parser', () => {
  const sampleCsvPath = path.join(__dirname, '../../data/sample_btcusd.csv');

  it('should correctly parse a valid OHLCV CSV file', async () => {
    const data = await parseCSV(sampleCsvPath);
    
    expect(data).toHaveLength(5);
    expect(data[0]).toEqual({
      timestamp: 1641427200000,
      open: 46000.5,
      high: 46500.0,
      low: 45800.0,
      close: 46200.0,
      volume: 150.5
    });
  });

  it('should throw an error for a non-existent file', async () => {
    await expect(parseCSV('non_existent.csv')).rejects.toThrow();
  });
});
