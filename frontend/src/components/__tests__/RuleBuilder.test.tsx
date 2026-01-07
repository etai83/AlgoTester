import { render, screen, fireEvent } from '@testing-library/react';
import RuleBuilder from '../RuleBuilder';

describe('RuleBuilder', () => {
  it('should render initial state with one condition', () => {
    render(<RuleBuilder onChange={() => {}} />);
    expect(screen.getByText(/Indicator/i)).toBeInTheDocument();
    expect(screen.getByText(/Operator/i)).toBeInTheDocument();
    expect(screen.getByText(/Value/i)).toBeInTheDocument();
  });

  it('should allow adding a new condition', () => {
    render(<RuleBuilder onChange={() => {}} />);
    const addButton = screen.getByText(/Add Condition/i);
    fireEvent.click(addButton);
    const indicators = screen.getAllByText(/Indicator/i);
    expect(indicators.length).toBeGreaterThan(1);
  });
});
