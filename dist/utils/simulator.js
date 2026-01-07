"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBacktest = runBacktest;
const ruleEngine_1 = require("./ruleEngine");
const indicators_1 = require("./indicators");
function runBacktest(data, rules, initialBalance, commission = 0) {
    // 1. Prepare Data with Indicators
    const prices = data.map(d => d.close);
    const sma50 = (0, indicators_1.calculateSMA)(prices, 50);
    const sma200 = (0, indicators_1.calculateSMA)(prices, 200);
    const ema9 = (0, indicators_1.calculateEMA)(prices, 9);
    const ema21 = (0, indicators_1.calculateEMA)(prices, 21);
    const rsi14 = (0, indicators_1.calculateRSI)(prices, 14);
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
    }));
    // 2. Simulation Loop
    let balance = initialBalance;
    let currentTrade = null;
    const trades = [];
    const equityCurve = [];
    let peakBalance = balance;
    let maxDrawdown = 0;
    for (let i = 0; i < enrichedData.length; i++) {
        const bar = enrichedData[i];
        if (!bar)
            continue; // Safety check for noUncheckedIndexedAccess
        // Check for signals only if we have a next bar to execute on
        const nextBar = enrichedData[i + 1];
        if (!currentTrade) {
            if ((0, ruleEngine_1.evaluateRule)(rules.entry, bar)) {
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
        }
        else {
            if ((0, ruleEngine_1.evaluateRule)(rules.exit, bar)) {
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
//# sourceMappingURL=simulator.js.map