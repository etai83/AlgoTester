"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indicators_1 = require("../utils/indicators");
describe('Indicator Calculations', () => {
    const prices = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    describe('SMA (Simple Moving Average)', () => {
        it('should correctly calculate 3-period SMA', () => {
            const result = (0, indicators_1.calculateSMA)(prices, 3);
            expect(result[0]).toBeNull();
            expect(result[1]).toBeNull();
            expect(result[2]).toBe(20);
            expect(result[3]).toBe(30);
            expect(result[4]).toBe(40);
        });
        it('should return nulls if prices length is less than period', () => {
            const result = (0, indicators_1.calculateSMA)([10, 20], 3);
            expect(result).toEqual([null, null]);
        });
    });
    describe('EMA (Exponential Moving Average)', () => {
        it('should correctly calculate 3-period EMA', () => {
            const result = (0, indicators_1.calculateEMA)(prices, 3);
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
            const result = (0, indicators_1.calculateRSI)(rsiPrices, 14);
            expect(result).toHaveLength(rsiPrices.length);
            expect(result[13]).toBeNull();
            expect(result[14]).toBeCloseTo(70.46, 1);
            expect(result[15]).toBeDefined();
        });
        it('should handle zero loss in RSI (RS becomes 100)', () => {
            const upwardPrices = [10, 20, 30, 40, 50, 60];
            const result = (0, indicators_1.calculateRSI)(upwardPrices, 3);
            expect(result[3]).toBe(100);
            expect(result[4]).toBe(100);
            expect(result[5]).toBe(100);
        });
    });
});
//# sourceMappingURL=indicators.test.js.map