import { OHLCV } from '../types/ohlcv';

export function calculateSMA(prices: number[], period: number): (number | null)[] {
  const sma: (number | null)[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

export function calculateEMA(prices: number[], period: number): (number | null)[] {
  const ema: (number | null)[] = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      ema.push(null);
    } else if (i === period - 1) {
      const sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
      ema.push(sum / period);
    } else {
      const currentPrice = prices[i];
      const prevEma = ema[i - 1];
      if (typeof currentPrice === 'number' && typeof prevEma === 'number') {
        ema.push((currentPrice - prevEma) * multiplier + prevEma);
      } else {
        ema.push(null);
      }
    }
  }
  return ema;
}

export function calculateRSI(prices: number[], period: number): (number | null)[] {
  if (prices.length === 0) return [];
  
  const rsi: (number | null)[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate changes first
  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];
    const prevPrice = prices[i - 1];
    
    if (typeof currentPrice === 'number' && typeof prevPrice === 'number') {
      const change = currentPrice - prevPrice;
      gains.push(Math.max(0, change));
      losses.push(Math.max(0, -change));
    } else {
        gains.push(0);
        losses.push(0);
    }
  }

  let avgGain = 0;
  let avgLoss = 0;

  // Initialize averages
  if (gains.length >= period) {
      for(let i = 0; i < period; i++) {
          avgGain += gains[i] || 0;
          avgLoss += losses[i] || 0;
      }
      avgGain /= period;
      avgLoss /= period;
  }

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsi.push(null);
    } else if (i === period) {
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
      }
    } else {
      const currentGain = gains[i - 1];
      const currentLoss = losses[i - 1];
      
      if (typeof currentGain === 'number' && typeof currentLoss === 'number') {
          avgGain = (avgGain * (period - 1) + currentGain) / period;
          avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
      }

      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
      }
    }
  }

  return rsi;
}

export function calculateIndicators(candles: OHLCV[]): OHLCV[] {
  const closes = candles.map(c => c.close);
  
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma100 = calculateSMA(closes, 100);
  const sma150 = calculateSMA(closes, 150);
  const sma200 = calculateSMA(closes, 200);
  const rsi = calculateRSI(closes, 14);

  return candles.map((candle, i) => {
    const enriched = { ...candle };
    if (sma20[i] !== null) enriched['SMA_20'] = sma20[i]!;
    if (sma50[i] !== null) enriched['SMA_50'] = sma50[i]!;
    if (sma100[i] !== null) enriched['SMA_100'] = sma100[i]!;
    if (sma150[i] !== null) enriched['SMA_150'] = sma150[i]!;
    if (sma200[i] !== null) enriched['SMA_200'] = sma200[i]!;
    if (rsi[i] !== null) enriched['RSI'] = rsi[i]!;
    return enriched;
  });
}