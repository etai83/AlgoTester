"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateRule = evaluateRule;
function evaluateRule(rule, data) {
    if (rule.type === 'comparison') {
        return evaluateComparison(rule, data);
    }
    else if (rule.type === 'operator') {
        return evaluateLogical(rule, data);
    }
    return false;
}
function evaluateComparison(rule, data) {
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
function evaluateLogical(rule, data) {
    if (rule.operator === 'AND') {
        return rule.conditions.every(condition => evaluateRule(condition, data));
    }
    else if (rule.operator === 'OR') {
        return rule.conditions.some(condition => evaluateRule(condition, data));
    }
    return false;
}
//# sourceMappingURL=ruleEngine.js.map