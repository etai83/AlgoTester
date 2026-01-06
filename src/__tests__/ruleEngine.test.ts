import { evaluateRule } from '../utils/ruleEngine';
import { Rule } from '../types/rules';

describe('Rule Engine', () => {
  const data = {
    close: 50000,
    sma_50: 48000,
    rsi: 30,
    prev_close: 49000
  };

  describe('Comparison Rules', () => {
    it('should evaluate simple comparison (close > sma_50)', () => {
      const rule: Rule = {
        type: 'comparison',
        left: 'close',
        operator: '>',
        right: 'sma_50'
      };
      expect(evaluateRule(rule, data)).toBe(true);
    });

    it('should evaluate comparison with constant (rsi < 40)', () => {
      const rule: Rule = {
        type: 'comparison',
        left: 'rsi',
        operator: '<',
        right: 40
      };
      expect(evaluateRule(rule, data)).toBe(true);
    });

    it('should evaluate comparison with constant (rsi > 40) as false', () => {
      const rule: Rule = {
        type: 'comparison',
        left: 'rsi',
        operator: '>',
        right: 40
      };
      expect(evaluateRule(rule, data)).toBe(false);
    });

    it('should evaluate >= correctly', () => {
      const rule: Rule = {
        type: 'comparison',
        left: 'close',
        operator: '>=',
        right: 50000
      };
      expect(evaluateRule(rule, data)).toBe(true);
    });

    it('should evaluate != correctly', () => {
      const rule: Rule = {
        type: 'comparison',
        left: 'rsi',
        operator: '!=',
        right: 40
      };
      expect(evaluateRule(rule, data)).toBe(true);
    });

    it('should return false for unknown operator in comparison', () => {
      const rule: any = {
        type: 'comparison',
        left: 'rsi',
        operator: 'UNKNOWN',
        right: 40
      };
      expect(evaluateRule(rule, data)).toBe(false);
    });

    it('should return false if values are missing in data', () => {
      const rule: Rule = {
        type: 'comparison',
        left: 'missing_key',
        operator: '>',
        right: 40
      };
      expect(evaluateRule(rule, data)).toBe(false);
    });
  });

  describe('Logical Rules', () => {
    it('should evaluate AND logic correctly', () => {
      const rule: Rule = {
        type: 'logical',
        operator: 'AND',
        conditions: [
          { type: 'comparison', left: 'close', operator: '>', right: 'sma_50' },
          { type: 'comparison', left: 'rsi', operator: '<=', right: 30 }
        ]
      };
      expect(evaluateRule(rule, data)).toBe(true);
    });

    it('should evaluate OR logic correctly', () => {
      const rule: Rule = {
        type: 'logical',
        operator: 'OR',
        conditions: [
          { type: 'comparison', left: 'close', operator: '<', right: 'sma_50' },
          { type: 'comparison', left: 'rsi', operator: '==', right: 30 }
        ]
      };
      expect(evaluateRule(rule, data)).toBe(true);
    });

    it('should return false for unknown logical operator', () => {
      const rule: any = {
        type: 'logical',
        operator: 'UNKNOWN',
        conditions: []
      };
      expect(evaluateRule(rule, data)).toBe(false);
    });
  });

  describe('General Rule Evaluation', () => {
    it('should return false for unknown rule type', () => {
      const rule: any = {
        type: 'unknown'
      };
      expect(evaluateRule(rule, data)).toBe(false);
    });
  });

  describe('Nested Rules', () => {
    it('should evaluate complex nested rules', () => {
      const rule: Rule = {
        type: 'logical',
        operator: 'AND',
        conditions: [
          {
            type: 'logical',
            operator: 'OR',
            conditions: [
              { type: 'comparison', left: 'close', operator: '>', right: 60000 },
              { type: 'comparison', left: 'rsi', operator: '<', right: 40 }
            ]
          },
          { type: 'comparison', left: 'close', operator: '>', right: 'prev_close' }
        ]
      };
      expect(evaluateRule(rule, data)).toBe(true);
    });
  });
});
