import { StrategyRules } from '../types/rules';
import { BacktestResult } from '../types/backtest';
export interface Strategy {
    id: string;
    name: string;
    rules: StrategyRules;
}
export interface HistoryItem extends BacktestResult {
    id: string;
    timestamp: number;
    rules: StrategyRules;
    initialBalance: number;
}
export declare function saveStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy>;
export declare function loadStrategies(): Promise<Strategy[]>;
export declare function saveSimulation(result: BacktestResult, rules: StrategyRules, initialBalance: number): Promise<HistoryItem>;
export declare function loadHistory(): Promise<HistoryItem[]>;
//# sourceMappingURL=storageService.d.ts.map