import { render, screen } from '@testing-library/react';
import ReturnsHistogram from '../ReturnsHistogram';

// Mock Recharts
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original as any,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('ReturnsHistogram', () => {
  const mockTrades = [
    { profit: 100 },
    { profit: -50 },
    { profit: 200 },
    { profit: -20 },
    { profit: 150 },
  ];

  it('should render the histogram container', () => {
    render(<ReturnsHistogram trades={mockTrades} />);
    expect(screen.getByText(/Distribution of Returns/i)).toBeInTheDocument();
  });
});
