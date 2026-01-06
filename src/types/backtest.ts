import { OHLCV } from './ohlcv';
import { Rule } from './rules';

export interface BacktestConfig {
  initialBalance: number;
  commission: number;
  entryRule: Rule;
  exitRule: Rule;
}

export interface Trade {
  entryTimestamp: number;
  entryPrice: number;
  exitTimestamp?: number;
  exitPrice?: number;
  quantity: number;
  profit?: number;
  profitPercentage?: number;
  status: 'open' | 'closed';
}

export interface BacktestResult {
  trades: Trade[];
  finalBalance: number;
  netProfit: number;
  winRate: number;
  maxDrawdown: number;
  equityCurve: number[];
}
