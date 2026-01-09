import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import History from '../History';
import * as api from '../../services/api';

vi.mock('../../services/api', () => ({
  fetchHistory: vi.fn(),
}));

describe('History', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders history items with file name', async () => {
    const mockHistory = [
      {
        id: '1',
        timestamp: Date.now(),
        stats: { totalProfit: 100, winRate: 0.5, totalTrades: 10 },
        initialBalance: 10000,
        fileName: 'test-data.csv',
        rules: { entry: {}, exit: {} }
      }
    ];

    (api.fetchHistory as any).mockResolvedValue(mockHistory);

    render(<History />);

    expect(screen.getByText('Loading history...')).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.queryByText('Loading history...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('test-data.csv')).toBeInTheDocument();
  });
});
