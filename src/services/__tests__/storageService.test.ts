import { saveStrategy, loadStrategies, saveSimulation, loadHistory, HistoryItem } from '../storageService';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');

describe('Storage Service', () => {
  const mockStrategies = [
    { id: '1', name: 'Test Strat', rules: {} }
  ];

  const mockHistory: HistoryItem[] = [
    {
      id: '1',
      timestamp: 123456789,
      rules: {} as any,
      initialBalance: 10000,
      fileName: 'test.csv',
      stats: { finalBalance: 10000, totalProfit: 0, winRate: 0, maxDrawdown: 0, totalTrades: 0 },
      trades: [],
      equityCurve: []
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save a strategy to JSON file', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue({ code: 'ENOENT' }); // File doesn't exist
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    await saveStrategy({ name: 'Test Strat', rules: {} as any });

    expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining('strategies.json'), expect.any(String));
  });

  it('should load strategies from JSON file', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockStrategies));

    const strategies = await loadStrategies();
    expect(strategies).toEqual(mockStrategies);
  });

  it('should save a simulation to JSON file', async () => {
     (fs.readFile as jest.Mock).mockResolvedValue('[]'); // Start with empty history
     (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

     const result = {
         stats: { finalBalance: 10000, totalProfit: 0, winRate: 0, maxDrawdown: 0, totalTrades: 0 },
         trades: [],
         equityCurve: []
     };
     const rules = {} as any;
     const initialBalance = 10000;
     const fileName = 'data.csv';

     await saveSimulation(result, rules, initialBalance, fileName);

     expect(fs.writeFile).toHaveBeenCalledWith(
         expect.stringContaining('history.json'),
         expect.stringContaining('"fileName": "data.csv"')
     );
  });

  it('should load history from JSON file', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockHistory));

      const history = await loadHistory();
      expect(history).toEqual(mockHistory);
  });
});
