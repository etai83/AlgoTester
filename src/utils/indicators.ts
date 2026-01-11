import { OHLCV } from '../types/ohlcv';

// Optimized SMA using sliding window - O(n) instead of O(n*period)
export function calculateSMA(prices: number[], period: number): (number | null)[] {
  const sma: (number | null)[] = [];
  let windowSum = 0;

  for (let i = 0; i < prices.length; i++) {
    windowSum += prices[i]!;

    if (i < period - 1) {
      sma.push(null);
    } else {
      if (i >= period) {
        windowSum -= prices[i - period]!;
      }
      sma.push(windowSum / period);
    }
  }
  return sma;
}

export function calculateEMA(prices: number[], period: number): (number | null)[] {
  const ema: (number | null)[] = [];
  const multiplier = 2 / (period + 1);
  let prevEma: number | null = null;

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      ema.push(null);
    } else if (i === period - 1) {
      // Initial EMA is SMA
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[j]!;
      }
      prevEma = sum / period;
      ema.push(prevEma);
    } else {
      const currentPrice = prices[i]!;
      prevEma = (currentPrice - prevEma!) * multiplier + prevEma!;
      ema.push(prevEma);
    }
  }
  return ema;
}

export function calculateRSI(prices: number[], period: number): (number | null)[] {
  if (prices.length === 0) return [];

  const rsi: (number | null)[] = [null]; // First element has no previous
  let avgGain = 0;
  let avgLoss = 0;

  // Calculate initial changes and averages
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i]! - prices[i - 1]!;
    const gain = Math.max(0, change);
    const loss = Math.max(0, -change);

    if (i < period) {
      avgGain += gain;
      avgLoss += loss;
      rsi.push(null);
    } else if (i === period) {
      avgGain = (avgGain + gain) / period;
      avgLoss = (avgLoss + loss) / period;

      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
      }
    } else {
      // Smoothed averages
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

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

export function calculateMACD(prices: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9): { macd: (number | null)[], signal: (number | null)[], histogram: (number | null)[] } {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  const macdLine: (number | null)[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (fastEMA[i] !== null && slowEMA[i] !== null) {
      macdLine.push(fastEMA[i]! - slowEMA[i]!);
    } else {
      macdLine.push(null);
    }
  }

  // Calculate Signal Line (EMA of MACD Line)
  const firstValidIndex = macdLine.findIndex(val => val !== null);
  const signalLine: (number | null)[] = new Array(prices.length).fill(null);

  if (firstValidIndex !== -1) {
    const validMacdValues = macdLine.slice(firstValidIndex) as number[];
    const signalValues = calculateEMA(validMacdValues, signalPeriod);

    for (let i = 0; i < signalValues.length; i++) {
      if (signalValues[i] !== null) {
        signalLine[firstValidIndex + i] = signalValues[i]!;
      }
    }
  }

  const histogram: (number | null)[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (macdLine[i] !== null && signalLine[i] !== null) {
      histogram.push(macdLine[i]! - signalLine[i]!);
    } else {
      histogram.push(null);
    }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}

// Optimized Bollinger Bands using incremental std dev calculation
export function calculateBollingerBands(prices: number[], period = 20, multiplier = 2): { upper: (number | null)[], middle: (number | null)[], lower: (number | null)[] } {
  const upper: (number | null)[] = [];
  const middle: (number | null)[] = [];
  const lower: (number | null)[] = [];

  let sum = 0;
  let sumSq = 0;

  for (let i = 0; i < prices.length; i++) {
    const price = prices[i]!;
    sum += price;
    sumSq += price * price;

    if (i < period - 1) {
      upper.push(null);
      middle.push(null);
      lower.push(null);
    } else {
      if (i >= period) {
        const oldPrice = prices[i - period]!;
        sum -= oldPrice;
        sumSq -= oldPrice * oldPrice;
      }

      const mean = sum / period;
      const variance = (sumSq / period) - (mean * mean);
      const stdDev = Math.sqrt(Math.max(0, variance)); // Ensure no negative due to floating point

      upper.push(mean + multiplier * stdDev);
      middle.push(mean);
      lower.push(mean - multiplier * stdDev);
    }
  }

  return { upper, middle, lower };
}

export function calculateATR(candles: OHLCV[], period = 14): (number | null)[] {
  if (candles.length === 0) return [];

  const result: (number | null)[] = [];
  let prevAtr = 0;
  let initialSum = 0;

  for (let i = 0; i < candles.length; i++) {
    let tr: number;

    if (i === 0) {
      tr = candles[0]!.high - candles[0]!.low;
    } else {
      const high = candles[i]!.high;
      const low = candles[i]!.low;
      const prevClose = candles[i - 1]!.close;
      tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    }

    if (i < period - 1) {
      initialSum += tr;
      result.push(null);
    } else if (i === period - 1) {
      initialSum += tr;
      prevAtr = initialSum / period;
      result.push(prevAtr);
    } else {
      prevAtr = (prevAtr * (period - 1) + tr) / period;
      result.push(prevAtr);
    }
  }

  return result;
}

// Optimized Stochastic using rolling min/max
export function calculateStochastic(candles: OHLCV[], period = 14, kSmooth = 3, dPeriod = 3): { k: (number | null)[], d: (number | null)[] } {
  const rawK: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      rawK.push(null);
    } else {
      let lowestLow = Infinity;
      let highestHigh = -Infinity;

      for (let j = i - period + 1; j <= i; j++) {
        lowestLow = Math.min(lowestLow, candles[j]!.low);
        highestHigh = Math.max(highestHigh, candles[j]!.high);
      }

      const currentClose = candles[i]!.close;
      if (highestHigh === lowestLow) {
        rawK.push(50);
      } else {
        rawK.push(((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100);
      }
    }
  }

  // Smooth %K with SMA if kSmooth > 1
  let smoothK: (number | null)[];
  if (kSmooth > 1) {
    const validStart = rawK.findIndex(x => x !== null);
    if (validStart === -1) {
      smoothK = rawK;
    } else {
      const validValues = rawK.slice(validStart) as number[];
      const smoothed = calculateSMA(validValues, kSmooth);
      smoothK = new Array(validStart).fill(null).concat(smoothed);
    }
  } else {
    smoothK = rawK;
  }

  // Calculate %D (SMA of smooth %K)
  const firstValidK = smoothK.findIndex(x => x !== null);
  let dLine: (number | null)[] = new Array(candles.length).fill(null);

  if (firstValidK !== -1) {
    const validKs = smoothK.slice(firstValidK) as number[];
    const smaD = calculateSMA(validKs, dPeriod);
    for (let j = 0; j < smaD.length && firstValidK + j < dLine.length; j++) {
      dLine[firstValidK + j] = smaD[j]!;
    }
  }

  return { k: smoothK, d: dLine };
}

export function calculateIndicators(candles: OHLCV[]): OHLCV[] {
  const closes = candles.map(c => c.close);

  // All these are now O(n) instead of O(n*period)
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma100 = calculateSMA(closes, 100);
  const sma150 = calculateSMA(closes, 150);
  const sma200 = calculateSMA(closes, 200);
  const ema9 = calculateEMA(closes, 9);
  const ema21 = calculateEMA(closes, 21);
  const rsi = calculateRSI(closes, 14);

  const macd = calculateMACD(closes);
  const bb = calculateBollingerBands(closes);
  const atr = calculateATR(candles);
  const stoch = calculateStochastic(candles);

  return candles.map((candle, i) => {
    const enriched: OHLCV & Record<string, number> = { ...candle };

    if (sma20[i] !== null) enriched['SMA_20'] = sma20[i]!;
    if (sma50[i] !== null) enriched['SMA_50'] = sma50[i]!;
    if (sma100[i] !== null) enriched['SMA_100'] = sma100[i]!;
    if (sma150[i] !== null) enriched['SMA_150'] = sma150[i]!;
    if (sma200[i] !== null) enriched['SMA_200'] = sma200[i]!;
    if (ema9[i] !== null) enriched['EMA_9'] = ema9[i]!;
    if (ema21[i] !== null) enriched['EMA_21'] = ema21[i]!;
    if (rsi[i] !== null) enriched['RSI'] = rsi[i]!;

    if (macd.macd[i] !== null) enriched['MACD'] = macd.macd[i]!;
    if (macd.signal[i] !== null) enriched['MACD_Signal'] = macd.signal[i]!;
    if (macd.histogram[i] !== null) enriched['MACD_Hist'] = macd.histogram[i]!;

    if (bb.upper[i] !== null) enriched['BB_Upper'] = bb.upper[i]!;
    if (bb.middle[i] !== null) enriched['BB_Middle'] = bb.middle[i]!;
    if (bb.lower[i] !== null) enriched['BB_Lower'] = bb.lower[i]!;

    if (atr[i] !== null) enriched['ATR'] = atr[i]!;

    if (stoch.k[i] !== null) enriched['Stoch_K'] = stoch.k[i]!;
    if (stoch.d[i] !== null) enriched['Stoch_D'] = stoch.d[i]!;

    return enriched;
  });
}