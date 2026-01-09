import { calculateSMA, calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands, calculateATR, calculateStochastic } from '../utils/indicators';
import { OHLCV } from '../types/ohlcv';

describe('Indicator Calculations', () => {
  const prices = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  
  // Helper to create simple OHLCV data
  const createCandles = (prices: number[]): OHLCV[] => {
      return prices.map((p, i) => ({
          timestamp: i * 60000,
          open: p,
          high: p + 5,
          low: p - 5,
          close: p,
          volume: 1000
      }));
  };

  describe('SMA (Simple Moving Average)', () => {
    it('should correctly calculate 3-period SMA', () => {
      const result = calculateSMA(prices, 3);
      expect(result[0]).toBeNull();
      expect(result[1]).toBeNull();
      expect(result[2]).toBe(20);
      expect(result[3]).toBe(30);
      expect(result[4]).toBe(40);
    });

    it('should return nulls if prices length is less than period', () => {
      const result = calculateSMA([10, 20], 3);
      expect(result).toEqual([null, null]);
    });
  });

  describe('EMA (Exponential Moving Average)', () => {
    it('should correctly calculate 3-period EMA', () => {
      const result = calculateEMA(prices, 3);
      expect(result[0]).toBeNull();
      expect(result[1]).toBeNull();
      expect(result[2]).toBe(20);
      expect(result[3]).toBe(30);
      expect(result[4]).toBe(40);
    });
  });

  describe('RSI (Relative Strength Index)', () => {
    it('should correctly calculate RSI', () => {
      const rsiPrices = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.10, 45.42, 45.84, 46.08, 45.89, 46.03, 45.61, 46.28, 46.28, 46.00];
      const result = calculateRSI(rsiPrices, 14);
      
      expect(result).toHaveLength(rsiPrices.length);
      expect(result[13]).toBeNull();
      expect(result[14]).toBeCloseTo(70.46, 1);
      expect(result[15]).toBeDefined();
    });

    it('should handle zero loss in RSI (RS becomes 100)', () => {
      const upwardPrices = [10, 20, 30, 40, 50, 60];
      const result = calculateRSI(upwardPrices, 3);
      expect(result[3]).toBe(100);
      expect(result[4]).toBe(100);
      expect(result[5]).toBe(100);
    });
  });

  describe('MACD', () => {
      it('should calculate MACD, Signal, and Histogram', () => {
          // Use a longer sequence for MACD (12, 26, 9) requires at least 26+9 data points for full validity, 
          // but we can check basic structure with fewer if we accept nulls
          const longPrices = Array.from({length: 50}, (_, i) => 10 + i); // Linear growth
          const result = calculateMACD(longPrices, 12, 26, 9);
          
          expect(result.macd).toHaveLength(50);
          expect(result.signal).toHaveLength(50);
          expect(result.histogram).toHaveLength(50);

          // First 25 should be null for MACD (period 26) - actually EMA returns null for first period-1 indices.
          // EMA(26) needs index 25 to be valid. So 0..24 are null.
          expect(result.macd[24]).toBeNull();
          expect(result.macd[25]).not.toBeNull();
          
          // Signal needs MACD to be valid for 9 periods. 
          // First valid MACD at 25.
          // Signal is EMA(9) of MACD. 
          // So it needs 9 valid MACD values (indices 25..33).
          // Signal valid at 25 + 8 = 33? 
          // My EMA implementation returns value at period-1 (index 8).
          // So if MACD valid from 25, Signal valid from 25+8 = 33.
          expect(result.signal[32]).toBeNull();
          expect(result.signal[33]).not.toBeNull();
      });
  });

  describe('Bollinger Bands', () => {
      it('should calculate Upper, Middle, Lower bands', () => {
          const result = calculateBollingerBands(prices, 5, 2);
          
          expect(result.upper).toHaveLength(10);
          expect(result.middle).toHaveLength(10);
          expect(result.lower).toHaveLength(10);

          expect(result.middle[4]).toBe(30); // SMA of 10,20,30,40,50 is 30
          // StdDev of 10,20,30,40,50. Mean=30. Diffs: -20, -10, 0, 10, 20. Sq: 400, 100, 0, 100, 400. Sum=1000. Var=200. SD=sqrt(200) ~= 14.14
          // Upper = 30 + 2*14.14 = 58.28
          expect(result.upper[4]).toBeCloseTo(58.28, 1);
          expect(result.lower[4]).toBeCloseTo(1.72, 1);
      });
  });

  describe('ATR', () => {
      it('should calculate ATR', () => {
          const candles = createCandles(prices);
          // High = p+5, Low = p-5. TR is at least 10.
          // If trend is steady, Close[i-1] = p-10. High[i] = p+5. |High - PrevClose| = |p+5 - (p-10)| = 15.
          // |Low - PrevClose| = |p-5 - (p-10)| = 5.
          // So TR should be 15 for all except first.
          
          const result = calculateATR(candles, 3);
          expect(result).toHaveLength(10);
          // 0..2 null?
          // My logic: loop i < period. i=0,1. sum TR. i=2 (period-1). set result.
          // So index 2 should be valid.
          expect(result[1]).toBeNull();
          expect(result[2]).toBeDefined();
          
          // Initial ATR at index 2 is SMA of TR[0], TR[1], TR[2].
          // TR[0] = H-L = 10.
          // TR[1] = 15.
          // TR[2] = 15.
          // Avg = 40/3 = 13.33
          expect(result[2]).toBeCloseTo(13.33, 1);
      });
  });

  describe('Stochastic', () => {
      it('should calculate K and D', () => {
          const candles = createCandles(prices);
          // Period 5, K_smooth 3, D_smooth 3.
          const result = calculateStochastic(candles, 5, 3, 3);
          
          expect(result.k).toHaveLength(10);
          expect(result.d).toHaveLength(10);
          
          // Raw K valid from index 4 (period-1).
          // Smoothed K (period 3) valid from index 4 + (3-1) = 6.
          expect(result.k[4]).toBeNull();
          expect(result.k[5]).toBeNull();
          expect(result.k[6]).toBe(90);
          
          // D is SMA(3) of K.
          // K valid from index 6.
          // D valid from index 6 + (3-1) = 8.
          expect(result.d[7]).toBeNull();
          expect(result.d[8]).toBe(90);
      });
  });

});
