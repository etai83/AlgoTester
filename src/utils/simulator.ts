import { OHLCV } from '../types/ohlcv';
import { BacktestConfig, BacktestResult, Trade } from '../types/backtest';
import { evaluateRule } from './ruleEngine';

export function runBacktest(
  data: (OHLCV & Record<string, number>)[],
  config: BacktestConfig
): BacktestResult {
  let balance = config.initialBalance;
  let currentTrade: Trade | null = null;
  const trades: Trade[] = [];
  const equityCurve: number[] = [];
  let peakBalance = balance;
  let maxDrawdown = 0;

  for (let i = 0; i < data.length; i++) {
    const bar = data[i];

    if (!currentTrade) {
      if (evaluateRule(config.entryRule, bar)) {
        const nextBar = data[i + 1];
        if (nextBar) {
          const entryPrice = nextBar.open;
          const commissionCost = balance * config.commission;
          const netBalance = balance - commissionCost;
          const quantity = netBalance / entryPrice;
          
          currentTrade = {
            entryTimestamp: nextBar.timestamp,
            entryPrice,
            quantity,
            status: 'open'
          };
          balance = 0;
        }
      }
    } else {
      if (evaluateRule(config.exitRule, bar)) {
        const nextBar = data[i + 1];
        if (nextBar) {
          const exitPrice = nextBar.open;
          const grossValue = currentTrade.quantity * exitPrice;
          const commissionCost = grossValue * config.commission;
          balance = grossValue - commissionCost;
          
          currentTrade.exitTimestamp = nextBar.timestamp;
          currentTrade.exitPrice = exitPrice;
          currentTrade.profit = balance - (currentTrade.entryPrice * currentTrade.quantity * (1 + config.commission));
          currentTrade.profitPercentage = (currentTrade.profit / (currentTrade.entryPrice * currentTrade.quantity)) * 100;
          currentTrade.status = 'closed';
          
          trades.push({ ...currentTrade });
          currentTrade = null;
        }
      }
    }

    const currentEquity = currentTrade 
      ? currentTrade.quantity * bar.close 
      : balance;
    
    equityCurve.push(currentEquity);
    
    if (currentEquity > peakBalance) {
      peakBalance = currentEquity;
    }
    
    const drawdown = peakBalance > 0 ? (peakBalance - currentEquity) / peakBalance : 0;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  const finalBalance = currentTrade 
    ? currentTrade.quantity * data[data.length - 1].close 
    : balance;

  const winningTrades = trades.filter(t => (t.profit || 0) > 0);
  const winRate = trades.length > 0 ? winningTrades.length / trades.length : 0;
  const netProfit = finalBalance - config.initialBalance;

  return {
    trades,
    finalBalance,
    netProfit,
    winRate,
    maxDrawdown,
    equityCurve
  };
}
