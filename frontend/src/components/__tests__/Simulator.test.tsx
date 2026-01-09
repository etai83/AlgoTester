import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Simulator from '../Simulator';
import * as api from '../../services/api';

// Polyfill crypto.randomUUID if necessary
if (!crypto.randomUUID) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: () => 'test-uuid-' + Math.random(),
  });
}

// Mock the api module
vi.mock('../../services/api', () => ({
  runBacktest: vi.fn(),
  previewCsv: vi.fn(),
}));

describe('Simulator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when running backtest', async () => {
    // Mock successful response
    (api.runBacktest as any).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      stats: {
        totalProfit: 100,
        winRate: 0.5,
        maxDrawdown: 0.1,
        totalTrades: 10
      },
      equityCurve: [],
      trades: []
    }), 100)));

    const { container } = render(<Simulator />);

    // Upload a file (simulated)
    // We mock the file input change
    const file = new File(['dummy'], 'test.csv', { type: 'text/csv' });
    const input = container.querySelector('input[type="file"]');
    if (input) {
        fireEvent.change(input, { target: { files: [file] } });
    }

    // Wait for file state (simulated by finding the button enable state or text)
    // The button says "Upload CSV" initially, changes to filename
    await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    // Find Run button
    const runButton = screen.getByText(/Run Backtest/i);
    expect(runButton).toBeEnabled();

    // Click run
    fireEvent.click(runButton);

    // Expect loading state (Overlay)
    expect(screen.getByText('Running Simulation...')).toBeInTheDocument();
    
    // Expect loading state (Button)
    expect(screen.getByText('Running...')).toBeInTheDocument();

    // Wait for finish
    await waitFor(() => {
        expect(screen.queryByText('Running Simulation...')).not.toBeInTheDocument();
    });
    
    // Check if results would be displayed (mocked data is empty so maybe some components break, but we just check loading gone)
  });
});
