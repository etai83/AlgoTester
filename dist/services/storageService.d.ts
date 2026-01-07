import { StrategyRules } from '../types/rules';
export interface Strategy {
    id: string;
    name: string;
    rules: StrategyRules;
}
export declare function saveStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy>;
export declare function loadStrategies(): Promise<Strategy[]>;
//# sourceMappingURL=storageService.d.ts.map