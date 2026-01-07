import { StrategyRules } from './rules';
export interface BacktestConfig {
    initialBalance: number;
    commission: number;
    entryRule: StrategyRules['entry'];
    exitRule: StrategyRules['exit'];
}
export interface Trade {
    type: 'BUY' | 'SELL';
    timestamp: number;
    price: number;
    quantity: number;
    profit?: number;
    profitPercentage?: number;
    status: 'OPEN' | 'CLOSED';
}
export interface BacktestResult {
    stats: {
        finalBalance: number;
        totalProfit: number;
        winRate: number;
        maxDrawdown: number;
        totalTrades: number;
    };
    trades: Trade[];
    equityCurve: {
        timestamp: number;
        price: number;
        balance: number;
    }[];
}
export interface BacktestRequest {
    csvFilePath: string;
    rules: StrategyRules;
    initialBalance?: number;
}
//# sourceMappingURL=backtest.d.ts.map