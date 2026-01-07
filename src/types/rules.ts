export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '==' | '!=';
export type LogicalOperator = 'AND' | 'OR';

export interface ComparisonRule {
  type: 'comparison';
  left: string;
  operator: ComparisonOperator;
  right: string | number;
}

export interface LogicalRule {
  type: 'operator'; // Fixed: was 'logical' in previous code but frontend sends 'operator'
  operator: LogicalOperator;
  conditions: Rule[];
}

export type Rule = ComparisonRule | LogicalRule;

export interface StrategyRules {
  entry: Rule;
  exit: Rule;
}