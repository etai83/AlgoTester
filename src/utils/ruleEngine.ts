import { Rule, ComparisonRule, LogicalRule } from '../types/rules';

export function evaluateRule(rule: Rule, data: Record<string, number>): boolean {
  if (rule.type === 'comparison') {
    return evaluateComparison(rule, data);
  } else if (rule.type === 'operator') {
    return evaluateLogical(rule, data);
  }
  return false;
}

function evaluateComparison(rule: ComparisonRule, data: Record<string, number>): boolean {
  const leftValue = data[rule.left];
  const rightValue = typeof rule.right === 'string' ? data[rule.right] : rule.right;

  if (leftValue === undefined || rightValue === undefined) {
    return false;
  }

  switch (rule.operator) {
    case '>':
      return leftValue > rightValue;
    case '<':
      return leftValue < rightValue;
    case '>=':
      return leftValue >= rightValue;
    case '<=':
      return leftValue <= rightValue;
    case '==':
      return leftValue === rightValue;
    case '!=':
      return leftValue !== rightValue;
    default:
      return false;
  }
}

function evaluateLogical(rule: LogicalRule, data: Record<string, number>): boolean {
  if (rule.operator === 'AND') {
    return rule.conditions.every(condition => evaluateRule(condition, data));
  } else if (rule.operator === 'OR') {
    return rule.conditions.some(condition => evaluateRule(condition, data));
  }
  return false;
}
