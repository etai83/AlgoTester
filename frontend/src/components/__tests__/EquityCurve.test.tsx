import { render, screen } from '@testing-library/react';
import EquityCurve from '../EquityCurve';

// Mock Recharts because it uses ResizeObserver which is not available in jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original as any,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('EquityCurve', () => {
  const mockData = [
    { timestamp: '2023-01-01', balance: 10000 },
    { timestamp: '2023-01-02', balance: 10500 },
    { timestamp: '2023-01-03', balance: 10300 },
  ];

  it('should render the chart container', () => {
    render(<EquityCurve data={mockData} />);
    expect(screen.getByText(/Equity Curve/i)).toBeInTheDocument();
  });
});
