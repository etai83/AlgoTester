"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSMA = calculateSMA;
exports.calculateEMA = calculateEMA;
exports.calculateRSI = calculateRSI;
function calculateSMA(prices, period) {
    const sma = [];
    for (let i = 0; i < prices.length; i++) {
        if (i < period - 1) {
            sma.push(null);
        }
        else {
            const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            sma.push(sum / period);
        }
    }
    return sma;
}
function calculateEMA(prices, period) {
    const ema = [];
    const multiplier = 2 / (period + 1);
    for (let i = 0; i < prices.length; i++) {
        if (i < period - 1) {
            ema.push(null);
        }
        else if (i === period - 1) {
            const sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
            ema.push(sum / period);
        }
        else {
            const currentPrice = prices[i];
            const prevEma = ema[i - 1];
            if (typeof currentPrice === 'number' && typeof prevEma === 'number') {
                ema.push((currentPrice - prevEma) * multiplier + prevEma);
            }
            else {
                ema.push(null);
            }
        }
    }
    return ema;
}
function calculateRSI(prices, period) {
    if (prices.length === 0)
        return [];
    const rsi = [];
    const gains = [];
    const losses = [];
    // Calculate changes first
    for (let i = 1; i < prices.length; i++) {
        const currentPrice = prices[i];
        const prevPrice = prices[i - 1];
        if (typeof currentPrice === 'number' && typeof prevPrice === 'number') {
            const change = currentPrice - prevPrice;
            gains.push(Math.max(0, change));
            losses.push(Math.max(0, -change));
        }
        else {
            gains.push(0);
            losses.push(0);
        }
    }
    let avgGain = 0;
    let avgLoss = 0;
    // Initialize averages
    if (gains.length >= period) {
        for (let i = 0; i < period; i++) {
            avgGain += gains[i] || 0;
            avgLoss += losses[i] || 0;
        }
        avgGain /= period;
        avgLoss /= period;
    }
    for (let i = 0; i < prices.length; i++) {
        if (i < period) {
            rsi.push(null);
        }
        else if (i === period) {
            if (avgLoss === 0) {
                rsi.push(100);
            }
            else {
                const rs = avgGain / avgLoss;
                rsi.push(100 - 100 / (1 + rs));
            }
        }
        else {
            const currentGain = gains[i - 1];
            const currentLoss = losses[i - 1];
            if (typeof currentGain === 'number' && typeof currentLoss === 'number') {
                avgGain = (avgGain * (period - 1) + currentGain) / period;
                avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
            }
            if (avgLoss === 0) {
                rsi.push(100);
            }
            else {
                const rs = avgGain / avgLoss;
                rsi.push(100 - 100 / (1 + rs));
            }
        }
    }
    return rsi;
}
//# sourceMappingURL=indicators.js.map