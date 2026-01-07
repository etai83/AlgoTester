import { saveStrategy, loadStrategies } from '../storageService';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');

describe('Storage Service', () => {
  const mockStrategies = [
    { id: '1', name: 'Test Strat', rules: {} }
  ];

  it('should save a strategy to JSON file', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue({ code: 'ENOENT' }); // File doesn't exist
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    await saveStrategy({ name: 'Test Strat', rules: {} as any });

    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('should load strategies from JSON file', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockStrategies));

    const strategies = await loadStrategies();
    expect(strategies).toEqual(mockStrategies);
  });
});
