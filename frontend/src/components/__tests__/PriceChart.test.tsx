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
    { type: 'BUY', timestamp: '2023-01-01', price: 16500 },
    { type: 'SELL', timestamp: '2023-01-03', price: 16700 },
  ];

  it('should render the price chart container', () => {
    render(<PriceChart data={mockData} trades={mockTrades} />);
    expect(screen.getByText(/BTCUSD Price Chart/i)).toBeInTheDocument();
  });
});
