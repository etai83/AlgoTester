import { render, screen } from '@testing-library/react';
import PriceChart from '../PriceChart';

// Mock Recharts
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original as any,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('PriceChart', () => {
  const mockData = [
    { timestamp: '2023-01-01', close: 16500 },
    { timestamp: '2023-01-02', close: 16800 },
    { timestamp: '2023-01-03', close: 16700 },
  ];
  const mockTrades = [
    { type: 'BUY' as const, timestamp: '2023-01-02', price: 105 },
    { type: 'SELL' as const, timestamp: '2023-01-04', price: 108 },
  ];

  it('should render the price chart container', () => {
    render(<PriceChart data={mockData} trades={mockTrades} />);
    expect(screen.getByText(/BTCUSD Price Chart/i)).toBeInTheDocument();
  });
});
