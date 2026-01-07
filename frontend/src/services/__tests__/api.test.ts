import { vi, describe, it, expect } from 'vitest';
import axios from 'axios';
import { runBacktest } from '../api';

vi.mock('axios');

describe('API Service', () => {
  it('should call the backtest endpoint with correct FormData', async () => {
    const mockResponse = { data: { success: true } };
    (axios.post as any).mockResolvedValue(mockResponse);

    const file = new File(['test'], 'data.csv', { type: 'text/csv' });
    const payload = {
      file,
      rules: { entry: {}, exit: {} },
      initialBalance: 10000,
    };

    const result = await runBacktest(payload);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/backtest/run'),
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );
    expect(result).toEqual(mockResponse.data);
  });
});