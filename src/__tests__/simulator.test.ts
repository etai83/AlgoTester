import { runBacktest } from '../utils/simulator';
import { OHLCV } from '../types/ohlcv';
import { StrategyRules } from '../types/rules';

describe('Trade Simulator', () => {
  const data: OHLCV[] = [
    { timestamp: 1, open: 100, high: 110, low: 90, close: 105, volume: 1000 },
    { timestamp: 2, open: 105, high: 115, low: 95, close: 110, volume: 1000 },
    { timestamp: 3, open: 110, high: 120, low: 100, close: 115, volume: 1000 },
    { timestamp: 4, open: 115, high: 125, low: 105, close: 120, volume: 1000 },
    { timestamp: 5, open: 120, high: 130, low: 110, close: 125, volume: 1000 },
  ];

  const rules: StrategyRules = {
    entry: { type: 'comparison', left: 'Close', operator: '>', right: 100 },
    exit: { type: 'comparison', left: 'Close', operator: '>', right: 130 } // Won't exit
  };

  it('should execute trades based on rules', () => {
    // Modify rules to trigger exit
    const rulesWithExit: StrategyRules = {
        entry: { type: 'comparison', left: 'Close', operator: '>', right: 100 }, // Trigger at t=1 (close 105 > 100) -> Buy at t=2 (Open 105)
        exit: { type: 'comparison', left: 'Close', operator: '>', right: 112 }   // Trigger at t=3 (close 115 > 112) -> Sell at t=4 (Open 115)
    };

    const result = runBacktest(data, rulesWithExit, 10000, 0);
    
    expect(result.trades.length).toBeGreaterThan(0);
    expect(result.equityCurve.length).toBe(data.length);
  });

  it('should calculate profit correctly', () => {
     const rulesWithExit: StrategyRules = {
        // Close > 100 AND Close < 110 to trigger only once at 105
        entry: { 
            type: 'operator', 
            operator: 'AND', 
            conditions: [
                { type: 'comparison', left: 'Close', operator: '>', right: 100 },
                { type: 'comparison', left: 'Close', operator: '<', right: 110 }
            ]
        }, 
        exit: { type: 'comparison', left: 'Close', operator: '>', right: 112 }
    };
    // Buy at 105 (t=2 open), Sell at 115 (t=4 open)
    // Profit per unit = 10
    const result = runBacktest(data, rulesWithExit, 10500, 0);
    
    expect(result.stats.totalProfit).toBeCloseTo(1000);
  });
});
