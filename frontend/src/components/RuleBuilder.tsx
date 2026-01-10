import { useState, forwardRef, useImperativeHandle } from 'react';

interface Condition {
  id: string;
  left: string;
  operator: string;
  right: string | number;
}

export interface RuleBuilderHandle {
  getRule: () => any;
  randomize: () => void;
}

interface RuleBuilderProps {
  title?: string;
}

const RuleBuilder = forwardRef<RuleBuilderHandle, RuleBuilderProps>(({ title = "Rule Builder" }, ref) => {
  const [conditions, setConditions] = useState<Condition[]>([
    { id: crypto.randomUUID(), left: 'Close', operator: '>', right: 'SMA_50' }
  ]);
  const [logicOperator, setLogicOperator] = useState<'AND' | 'OR'>('AND');

  useImperativeHandle(ref, () => ({
    getRule: () => {
      if (conditions.length === 1) {
        return {
          type: 'comparison',
          left: conditions[0].left,
          operator: conditions[0].operator,
          right: conditions[0].right
        };
      } else {
        return {
          type: 'operator',
          operator: logicOperator,
          conditions: conditions.map(c => ({
            type: 'comparison',
            left: c.left,
            operator: c.operator,
            right: c.right
          }))
        };
      }
    },
    randomize: () => {
      const randomLeft = LEFT_INDICATORS[Math.floor(Math.random() * LEFT_INDICATORS.length)];
      const operators = ['>', '<', '>=', '<=', '=='];
      const randomOperator = operators[Math.floor(Math.random() * operators.length)];

      // 50% chance of indicator, 50% chance of custom value
      let randomRight: string | number;
      if (Math.random() > 0.5) {
        randomRight = INDICATORS[Math.floor(Math.random() * INDICATORS.length)];
        // Prevent comparing same indicator to itself if possible, though not strictly forbidden
        if (randomRight === randomLeft) {
          // pick another or keep it (it's valid valid comparison, e.g. SMA_50 > SMA_50 is always false/true but valid syntax)
        }
      } else {
        // Random number between 1 and 100 for simplicity
        randomRight = Math.floor(Math.random() * 100) + 1;
      }

      setConditions([{
        id: crypto.randomUUID(),
        left: randomLeft,
        operator: randomOperator,
        right: randomRight
      }]);
    }
  }));

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: crypto.randomUUID(), left: 'RSI', operator: '<', right: 30 }
    ]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const updateCondition = (id: string, field: keyof Condition, value: string | number) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const INDICATORS = [
    'SMA_20', 'SMA_50', 'SMA_100', 'SMA_150', 'SMA_200', 'RSI',
    'MACD', 'MACD_Signal', 'MACD_Hist',
    'BB_Upper', 'BB_Middle', 'BB_Lower',
    'ATR',
    'Stoch_K', 'Stoch_D'
  ];
  const LEFT_INDICATORS = ['Close', 'EMA_9', 'EMA_21', ...INDICATORS];

  return (
    <div className="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
      </div>

      {conditions.length > 1 && (
        <div className="mb-4 flex items-center gap-2 bg-surface-darker/50 p-2 rounded-lg border border-border-dark/50 w-fit">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider pl-1">Match</span>
          <select
            value={logicOperator}
            onChange={(e) => setLogicOperator(e.target.value as 'AND' | 'OR')}
            className="bg-[#1c1f27] text-white rounded px-2 py-1 text-sm border border-border-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="AND">ALL (AND)</option>
            <option value="OR">ANY (OR)</option>
          </select>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider pr-1">conditions</span>
        </div>
      )}

      <div className="space-y-3">
        {conditions.map((condition) => {
          const isCustom = !INDICATORS.includes(String(condition.right));
          return (
            <div key={condition.id} className="flex items-center gap-3 bg-surface-darker p-3 rounded-lg border border-border-dark/50 group hover:border-border-dark transition-colors">
              <div className="flex-1 grid grid-cols-10 gap-3">
                <div className="col-span-4">
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase font-semibold">Indicator</label>
                  <select
                    value={condition.left}
                    onChange={(e) => updateCondition(condition.id, 'left', e.target.value)}
                    className="w-full bg-[#1c1f27] text-white rounded px-2 py-1.5 text-sm border border-border-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {LEFT_INDICATORS.map(ind => (
                      <option key={ind} value={ind}>{ind.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase font-semibold">Op</label>
                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(condition.id, 'operator', e.target.value)}
                    className="w-full bg-[#1c1f27] text-white rounded px-2 py-1.5 text-sm border border-border-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center"
                  >
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                    <option value=">=">{'>='}</option>
                    <option value="<=">{'<='}</option>
                    <option value="==">{'=='}</option>
                  </select>
                </div>
                <div className="col-span-4">
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase font-semibold">Value</label>
                  <div className="flex gap-2">
                    <select
                      value={isCustom ? 'CUSTOM' : condition.right}
                      onChange={(e) => {
                        if (e.target.value === 'CUSTOM') {
                          updateCondition(condition.id, 'right', 0);
                        } else {
                          updateCondition(condition.id, 'right', e.target.value);
                        }
                      }}
                      className="flex-1 bg-[#1c1f27] text-white rounded px-2 py-1.5 text-sm border border-border-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="CUSTOM">Custom</option>
                      {INDICATORS.map(ind => (
                        <option key={ind} value={ind}>{ind.replace('_', ' ')}</option>
                      ))}
                    </select>
                    {isCustom && (
                      <input
                        type="number"
                        value={condition.right}
                        onChange={(e) => updateCondition(condition.id, 'right', Number(e.target.value))}
                        className="w-16 bg-[#1c1f27] text-white rounded px-2 py-1.5 text-sm border border-border-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    )}
                  </div>
                </div>
              </div>
              {conditions.length > 1 && (
                <button
                  onClick={() => removeCondition(condition.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors mt-4 self-start"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={addCondition}
        className="mt-4 flex items-center justify-center w-full py-2 space-x-2 text-sm text-primary hover:text-white hover:bg-primary/10 border border-dashed border-primary/30 hover:border-primary/50 rounded-lg transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        <span>Add Condition</span>
      </button>
    </div>
  );
});

export default RuleBuilder;