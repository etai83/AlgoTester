"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ruleEngine_1 = require("../utils/ruleEngine");
describe('Rule Engine', () => {
    const data = {
        Close: 50000,
        SMA_50: 48000,
        RSI: 30,
        Prev_Close: 49000
    };
    describe('Comparison Rules', () => {
        it('should evaluate simple comparison (Close > SMA_50)', () => {
            const rule = {
                type: 'comparison',
                left: 'Close',
                operator: '>',
                right: 'SMA_50'
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(true);
        });
        it('should evaluate comparison with constant (RSI < 40)', () => {
            const rule = {
                type: 'comparison',
                left: 'RSI',
                operator: '<',
                right: 40
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(true);
        });
        it('should evaluate comparison with constant (RSI > 40) as false', () => {
            const rule = {
                type: 'comparison',
                left: 'RSI',
                operator: '>',
                right: 40
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(false);
        });
        it('should evaluate >= correctly', () => {
            const rule = {
                type: 'comparison',
                left: 'Close',
                operator: '>=',
                right: 50000
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(true);
        });
        it('should evaluate != correctly', () => {
            const rule = {
                type: 'comparison',
                left: 'RSI',
                operator: '!=',
                right: 40
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(true);
        });
        it('should return false for unknown operator in comparison', () => {
            const rule = {
                type: 'comparison',
                left: 'RSI',
                operator: 'UNKNOWN',
                right: 40
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(false);
        });
        it('should return false if values are missing in data', () => {
            const rule = {
                type: 'comparison',
                left: 'missing_key',
                operator: '>',
                right: 40
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(false);
        });
    });
    describe('Logical Rules', () => {
        it('should evaluate AND logic correctly', () => {
            const rule = {
                type: 'operator',
                operator: 'AND',
                conditions: [
                    { type: 'comparison', left: 'Close', operator: '>', right: 100 },
                    { type: 'comparison', left: 'RSI', operator: '<', right: 40 },
                ],
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(true);
        });
        it('should evaluate OR logic correctly', () => {
            const rule = {
                type: 'operator',
                operator: 'OR',
                conditions: [
                    { type: 'comparison', left: 'Close', operator: '<', right: 'SMA_50' },
                    { type: 'comparison', left: 'RSI', operator: '==', right: 30 }
                ]
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(true);
        });
        it('should return false for unknown logical operator', () => {
            const rule = {
                type: 'operator',
                operator: 'UNKNOWN',
                conditions: []
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(false);
        });
    });
    describe('General Rule Evaluation', () => {
        it('should return false for unknown rule type', () => {
            const rule = {
                type: 'unknown'
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(false);
        });
    });
    describe('Nested Rules', () => {
        it('should evaluate complex nested rules', () => {
            const rule = {
                type: 'operator',
                operator: 'AND',
                conditions: [
                    {
                        type: 'operator',
                        operator: 'OR',
                        conditions: [
                            { type: 'comparison', left: 'Close', operator: '>', right: 60000 },
                            { type: 'comparison', left: 'RSI', operator: '<', right: 40 }
                        ]
                    },
                    { type: 'comparison', left: 'Close', operator: '>', right: 'Prev_Close' }
                ]
            };
            expect((0, ruleEngine_1.evaluateRule)(rule, data)).toBe(true);
        });
    });
});
//# sourceMappingURL=ruleEngine.test.js.map