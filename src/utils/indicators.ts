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

export function calculateMACD(prices: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9): { macd: (number | null)[], signal: (number | null)[], histogram: (number | null)[] } {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  const macdLine: (number | null)[] = [];
  for(let i = 0; i < prices.length; i++) {
      if (fastEMA[i] !== null && slowEMA[i] !== null) {
          macdLine.push(fastEMA[i]! - slowEMA[i]!);
      } else {
          macdLine.push(null);
      }
  }

  // Calculate Signal Line (EMA of MACD Line)
  // We need to filter out initial nulls to calculate EMA correctly
  const firstValidIndex = macdLine.findIndex(val => val !== null);
  let signalLine: (number | null)[] = new Array(prices.length).fill(null);
  
  if (firstValidIndex !== -1) {
      const validMacdValues = macdLine.slice(firstValidIndex) as number[];
      const signalValues = calculateEMA(validMacdValues, signalPeriod);
      
      // Place signal values back into the correct positions
      for (let i = 0; i < signalValues.length; i++) {
          if (signalValues[i] !== undefined) {
             signalLine[firstValidIndex + i] = signalValues[i]!;
          }
      }
  }

  const histogram: (number | null)[] = [];
  for(let i = 0; i < prices.length; i++) {
      if (macdLine[i] !== null && signalLine[i] !== null) {
          histogram.push(macdLine[i]! - signalLine[i]!);
      } else {
          histogram.push(null);
      }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}

export function calculateBollingerBands(prices: number[], period = 20, multiplier = 2): { upper: (number | null)[], middle: (number | null)[], lower: (number | null)[] } {
    const sma = calculateSMA(prices, period);
    const upper: (number | null)[] = [];
    const lower: (number | null)[] = [];

    for (let i = 0; i < prices.length; i++) {
        if (i < period - 1) {
            upper.push(null);
            lower.push(null);
        } else {
            const slice = prices.slice(i - period + 1, i + 1);
            const mean = sma[i]!;
            const squaredDiffs = slice.map(val => Math.pow(val - mean, 2));
            const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
            const stdDev = Math.sqrt(variance);

            upper.push(mean + (multiplier * stdDev));
            lower.push(mean - (multiplier * stdDev));
        }
    }

    return { upper, middle: sma, lower };
}

export function calculateATR(candles: OHLCV[], period = 14): (number | null)[] {
    const tr: number[] = [0]; // First TR is 0 or High-Low, usually handled differently but let's say 0 for index alignment
    
    // Calculate True Range
    for (let i = 1; i < candles.length; i++) {
        const high = candles[i]?.high;
        const low = candles[i]?.low;
        const prevClose = candles[i-1]?.close;
        
        if (high !== undefined && low !== undefined && prevClose !== undefined) {
             const tr1 = high - low;
             const tr2 = Math.abs(high - prevClose);
             const tr3 = Math.abs(low - prevClose);
             tr.push(Math.max(tr1, tr2, tr3));
        } else {
            tr.push(0);
        }
    }

    // First TR is usually just H-L
    if (candles.length > 0 && candles[0]) {
        tr[0] = candles[0].high - candles[0].low;
    }

    const atr: (number | null)[] = [];
    let prevAtr = 0;

    // Reset
    const result: (number | null)[] = [];
    let initialSum = 0;
    
    for (let i = 0; i < candles.length; i++) {
        if (i < period) {
             initialSum += tr[i] || 0;
             if (i === period - 1) {
                 prevAtr = initialSum / period;
                 result.push(prevAtr);
             } else {
                 result.push(null);
             }
        } else {
            prevAtr = (prevAtr * (period - 1) + (tr[i] || 0)) / period;
            result.push(prevAtr);
        }
    }
    
    return result;
}

export function calculateStochastic(candles: OHLCV[], period = 14, kPeriod = 3, dPeriod = 3): { k: (number | null)[], d: (number | null)[] } {
    const kLine: (number | null)[] = [];

    for (let i = 0; i < candles.length; i++) {
        if (i < period - 1) {
            kLine.push(null);
        } else {
            const lookback = candles.slice(i - period + 1, i + 1);
            const lowestLow = Math.min(...lookback.map(c => c.low));
            const highestHigh = Math.max(...lookback.map(c => c.high));
            const currentClose = candles[i]?.close;

            if (currentClose !== undefined && highestHigh === lowestLow) {
                kLine.push(50); // Avoid division by zero
            } else if (currentClose !== undefined) {
                const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
                kLine.push(k);
            } else {
                kLine.push(null);
            }
        }
    }

    let smoothK = kLine;
    if (kPeriod > 1) {
        // We need to smooth the valid values of kLine
        const firstValid = kLine.findIndex(x => x !== null);
        if (firstValid !== -1) {
            const validKs = kLine.slice(firstValid) as number[];
            const smoothed = calculateSMA(validKs, kPeriod);
             // Realign
             smoothK = new Array(kLine.length).fill(null);
             for(let j=0; j<smoothed.length; j++) {
                 const val = smoothed[j];
                 if (val !== null && val !== undefined && (firstValid + j) < smoothK.length) {
                     smoothK[firstValid + j] = val;
                 }
             }
        }
    }

    // Calculate %D (SMA of %K)
    const firstValidK = smoothK.findIndex(x => x !== null);
    let dLine: (number | null)[] = new Array(candles.length).fill(null);
    
    if (firstValidK !== -1) {
        const validKs = smoothK.slice(firstValidK) as number[];
        const smaD = calculateSMA(validKs, dPeriod);
         for(let j=0; j<smaD.length; j++) {
             const val = smaD[j];
             if (val !== null && val !== undefined && (firstValidK + j) < dLine.length) {
                 dLine[firstValidK + j] = val;
             }
         }
    }

    return { k: smoothK, d: dLine };
}

export function calculateIndicators(candles: OHLCV[]): OHLCV[] {
  const closes = candles.map(c => c.close);
  
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
    const enriched = { ...candle };
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