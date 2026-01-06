import { runBacktest } from '../utils/simulator';
import { OHLCV } from '../types/ohlcv';
import { BacktestConfig } from '../types/backtest';

describe('Trade Simulator', () => {
  const data: (OHLCV & Record<string, number>)[] = [
    { timestamp: 1, open: 100, high: 110, low: 90, close: 105, volume: 10, sma_50: 100 },
    { timestamp: 2, open: 105, high: 115, low: 100, close: 110, volume: 10, sma_50: 101 },
    { timestamp: 3, open: 110, high: 120, low: 105, close: 115, volume: 10, sma_50: 102 },
    { timestamp: 4, open: 115, high: 115, low: 100, close: 105, volume: 10, sma_50: 103 },
    { timestamp: 5, open: 105, high: 105, low: 90, close: 95, volume: 10, sma_50: 104 },
    { timestamp: 6, open: 95, high: 100, low: 90, close: 98, volume: 10, sma_50: 105 }
  ];

  const config: BacktestConfig = {
    initialBalance: 1000,
    commission: 0,
    entryRule: { type: 'comparison', left: 'close', operator: '>', right: 'sma_50' },
    exitRule: { type: 'comparison', left: 'close', operator: '<', right: 'sma_50' }
  };

  it('should execute trades based on rules', () => {
    const result = runBacktest(data, config);
    expect(result.trades.length).toBeGreaterThan(0);
    expect(result.equityCurve.length).toBe(data.length);
  });

  it('should calculate profit correctly with commission', () => {
    const configWithCommission: BacktestConfig = {
      ...config,
      commission: 0.01
    };
    const result = runBacktest(data, configWithCommission);
    const resultNoCommission = runBacktest(data, config);
    expect(result.finalBalance).toBeLessThan(resultNoCommission.finalBalance);
  });

  it('should calculate max drawdown correctly', () => {
    const result = runBacktest(data, config);
    expect(result.maxDrawdown).toBeGreaterThanOrEqual(0);
  });

  it('should handle no trades', () => {
    const noTradeConfig: BacktestConfig = {
      ...config,
      entryRule: { type: 'comparison', left: 'close', operator: '>', right: 1000 }
    };
    const result = runBacktest(data, noTradeConfig);
    expect(result.trades.length).toBe(0);
    expect(result.winRate).toBe(0);
  });

  it('should handle open trade at the end', () => {
    const openTradeData = data.slice(0, 2);
    const result = runBacktest(openTradeData, config);
    expect(result.trades.length).toBe(0);
    expect(result.finalBalance).toBeCloseTo(openTradeData[1].close * (1000 / openTradeData[1].open));
  });

  it('should calculate win rate correctly with losing trades', () => {
    const losingData: (OHLCV & Record<string, number>)[] = [
      { timestamp: 1, open: 100, high: 110, low: 90, close: 105, volume: 10, sma_50: 100 },
      { timestamp: 2, open: 100, high: 110, low: 90, close: 110, volume: 10, sma_50: 100 },
      { timestamp: 3, open: 90, high: 95, low: 80, close: 85, volume: 10, sma_50: 100 },
      { timestamp: 4, open: 80, high: 85, low: 75, close: 78, volume: 10, sma_50: 100 },
    ];
    const result = runBacktest(losingData, config);
    expect(result.trades.length).toBe(1);
    expect(result.trades[0].profit).toBeLessThan(0);
    expect(result.winRate).toBe(0);
  });
});
