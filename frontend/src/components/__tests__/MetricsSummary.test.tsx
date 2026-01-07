import { render, screen } from '@testing-library/react';
import MetricsSummary from '../MetricsSummary';

describe('MetricsSummary', () => {
  const mockStats = {
    totalProfit: 1250.50,
    winRate: 0.65,
    maxDrawdown: -0.12,
    totalTrades: 45
  };

  it('should render all metrics correctly', () => {
    render(<MetricsSummary stats={mockStats} />);
    expect(screen.getByText(/\$1,250.50/i)).toBeInTheDocument();
    expect(screen.getByText(/65.00%/i)).toBeInTheDocument();
    expect(screen.getByText(/-12.00%/i)).toBeInTheDocument();
    expect(screen.getByText(/45/i)).toBeInTheDocument();
  });
});
