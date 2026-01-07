import { OHLCV } from '../types/ohlcv';
import { StrategyRules } from '../types/rules';
import { BacktestResult, Trade } from '../types/backtest';
import { evaluateRule } from './ruleEngine';
import { calculateSMA, calculateEMA, calculateRSI } from './indicators';

export function runBacktest(
  data: OHLCV[],
  rules: StrategyRules,
  initialBalance: number,
  commission: number = 0
): BacktestResult {
  // 1. Prepare Data with Indicators
  const prices = data.map(d => d.close);
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, 200);
  const ema9 = calculateEMA(prices, 9);
  const ema21 = calculateEMA(prices, 21);
  const rsi14 = calculateRSI(prices, 14);

  const enrichedData = data.map((d, i) => ({
    ...d,
    Close: d.close, // Alias for rule engine (capitalized)
    Open: d.open,
    High: d.high,
    Low: d.low,
    Volume: d.volume,
    SMA_50: sma50[i] ?? undefined,
    SMA_200: sma200[i] ?? undefined,
    EMA_9: ema9[i] ?? undefined,
    EMA_21: ema21[i] ?? undefined,
    RSI: rsi14[i] ?? undefined
  })) as (OHLCV & Record<string, number | undefined>)[];

  // 2. Simulation Loop
  let balance = initialBalance;
  let currentTrade: Trade | null = null;
  const trades: Trade[] = [];
  const equityCurve: { timestamp: number; price: number; balance: number }[] = [];
  let peakBalance = balance;
  let maxDrawdown = 0;

  for (let i = 0; i < enrichedData.length; i++) {
    const bar = enrichedData[i];
    if (!bar) continue; // Safety check for noUncheckedIndexedAccess

    // Check for signals only if we have a next bar to execute on
    const nextBar = enrichedData[i + 1];

    if (!currentTrade) {
      if (evaluateRule(rules.entry, bar as Record<string, number>)) {
        if (nextBar) {
          const entryPrice = nextBar.open;
          const quantity = (balance * (1 - commission)) / entryPrice;
          
          if (quantity > 0) {
             currentTrade = {
              type: 'BUY',
              timestamp: nextBar.timestamp,
              price: entryPrice,
              quantity,
              status: 'OPEN'
            };
            balance = 0; // All in
          }
        }
      }
    } else {
      if (evaluateRule(rules.exit, bar as Record<string, number>)) {
        if (nextBar) {
          const exitPrice = nextBar.open;
          const grossValue = currentTrade.quantity * exitPrice;
          const commissionCost = grossValue * commission;
          balance = grossValue - commissionCost;
          
          currentTrade.status = 'CLOSED';
          currentTrade.profit = balance - (currentTrade.price * currentTrade.quantity / (1 - commission)); 
          
          trades.push({ 
              ...currentTrade, 
              type: 'SELL', 
              timestamp: nextBar.timestamp,
              price: exitPrice,
              profit: balance - (currentTrade.quantity * currentTrade.price)
          });
          currentTrade = null;
        }
      }
    }

    // Update Equity Curve
    const currentEquity = currentTrade 
      ? currentTrade.quantity * bar.close 
      : balance;
    
    equityCurve.push({
        timestamp: bar.timestamp,
        price: bar.close,
        balance: currentEquity
    });
    
    if (currentEquity > peakBalance) {
      peakBalance = currentEquity;
    }
    
    const drawdown = peakBalance > 0 ? (peakBalance - currentEquity) / peakBalance : 0;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  // Close open trade at end for stats
  if (currentTrade) {
      const lastBar = enrichedData[enrichedData.length - 1];
      if (lastBar) {
        const lastPrice = lastBar.close;
        const grossValue = currentTrade.quantity * lastPrice;
        balance = grossValue * (1 - commission);
      }
  }

  const netProfit = balance - initialBalance;
  const winningTrades = trades.filter(t => (t.profit || 0) > 0);
  const winRate = trades.length > 0 ? winningTrades.length / trades.length : 0;

  return {
    stats: {
        finalBalance: balance,
        totalProfit: netProfit,
        winRate,
        maxDrawdown,
        totalTrades: trades.length
    },
    trades,
    equityCurve
  };
}
