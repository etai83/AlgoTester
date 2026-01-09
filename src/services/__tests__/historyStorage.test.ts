import { saveSimulation, loadHistory } from '../storageService';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('History Storage Service', () => {
  const mockHistory = [
    { 
        id: '1', 
        timestamp: 123, 
        rules: {} as any, 
        initialBalance: 1000,
        stats: {} as any,
        trades: [],
        equityCurve: [] 
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save a simulation to JSON file', async () => {
    // Mock loadHistory to return empty array
    (fs.readFile as jest.Mock).mockResolvedValue('[]');
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    const result = { stats: {}, trades: [], equityCurve: [] } as any;
    const rules = {} as any;
    const initialBalance = 10000;

    await saveSimulation(result, rules, initialBalance, 'test_file.csv');

    expect(fs.readFile).toHaveBeenCalledWith('history.json', 'utf-8');
    expect(fs.writeFile).toHaveBeenCalled();
    
    // Verify the write call arguments
    const writeCall = (fs.writeFile as jest.Mock).mock.calls[0];
    expect(writeCall[0]).toBe('history.json');
    const writtenData = JSON.parse(writeCall[1]);
    expect(writtenData).toHaveLength(1);
    expect(writtenData[0].initialBalance).toBe(initialBalance);
  });

  it('should load history from JSON file', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockHistory));

    const history = await loadHistory();
    expect(history).toHaveLength(1);
    expect(history[0]!.id).toBe('1');
  });

  it('should return empty array if history file does not exist', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue({ code: 'ENOENT' });

    const history = await loadHistory();
    expect(history).toEqual([]);
  });
});
