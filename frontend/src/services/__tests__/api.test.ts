import { vi, describe, it, expect } from 'vitest';
import axios from 'axios';
import { runBacktest } from '../api';

vi.mock('axios');

describe('API Service', () => {
  it('should call the backtest endpoint with correct parameters', async () => {
    const mockResponse = { data: { success: true } };
    (axios.post as any).mockResolvedValue(mockResponse);

    const payload = {
      csvFilePath: 'test.csv',
      rules: { entry: {}, exit: {} },
      initialBalance: 10000,
    };

    const result = await runBacktest(payload);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/backtest/run', payload);
    expect(result).toEqual(mockResponse.data);
  });
});
