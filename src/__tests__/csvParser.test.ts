import { parseCsv } from '../utils/csvParser';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('CSV Parser', () => {
  it('should correctly parse a valid OHLCV CSV file', async () => {
    const mockCsvContent = `timestamp,open,high,low,close,volume
1672531200000,16547.9,16600,16500,16580,100
1672534800000,16580,16650,16550,16620,150
1672538400000,16620,16700,16600,16680,200
1672542000000,16680,16750,16650,16720,250
1672545600000,16720,16800,16700,16750,300`;

    (fs.readFile as jest.Mock).mockResolvedValue(mockCsvContent);

    const data = await parseCsv('test.csv');

    expect(data).toHaveLength(5);
    expect(data[0]).toEqual({
      timestamp: 1672531200000,
      open: 16547.9,
      high: 16600,
      low: 16500,
      close: 16580,
      volume: 100
    });
  });

  it('should throw an error for a non-existent file', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

    await expect(parseCsv('non_existent.csv')).rejects.toThrow();
  });
});