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
      const prevEma = ema[i - 1] as number;
      ema.push((prices[i] - prevEma) * multiplier + prevEma);
    }
  }
  return ema;
}

export function calculateRSI(prices: number[], period: number): (number | null)[] {
  const rsi: (number | null)[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(Math.max(0, change));
    losses.push(Math.max(0, -change));
  }

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsi.push(null);
      if (i > 0) {
        avgGain += gains[i - 1];
        avgLoss += losses[i - 1];
      }
      if (i === period - 1) {
        avgGain /= period;
        avgLoss /= period;
      }
    } else if (i === period) {
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
      }
    } else {
      avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
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
