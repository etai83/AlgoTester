import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Condition {
  id: string;
  left: string;
  operator: string;
  right: string | number;
}

interface RuleBuilderProps {
  onChange: (rule: any) => void;
  title?: string;
}

export default function RuleBuilder({ onChange, title = "Rule Builder" }: RuleBuilderProps) {
  const [conditions, setConditions] = useState<Condition[]>([
    { id: crypto.randomUUID(), left: 'Close', operator: '>', right: 'SMA_50' }
  ]);
  const [logicOperator, setLogicOperator] = useState<'AND' | 'OR'>('AND');

  useEffect(() => {
    if (conditions.length === 1) {
      onChange({
        type: 'comparison',
        left: conditions[0].left,
        operator: conditions[0].operator,
        right: conditions[0].right
      });
    } else {
      onChange({
        type: 'operator',
        operator: logicOperator,
        conditions: conditions.map(c => ({
          type: 'comparison',
          left: c.left,
          operator: c.operator,
          right: c.right
        }))
      });
    }
  }, [conditions, logicOperator, onChange]);

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

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">{title}</h3>
      
      {conditions.length > 1 && (
        <div className="mb-4 flex items-center space-x-2">
          <span className="text-sm text-gray-400">Match</span>
          <select 
            value={logicOperator} 
            onChange={(e) => setLogicOperator(e.target.value as 'AND' | 'OR')}
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="AND">ALL (AND)</option>
            <option value="OR">ANY (OR)</option>
          </select>
          <span className="text-sm text-gray-400">conditions</span>
        </div>
      )}

      <div className="space-y-3">
        {conditions.map((condition) => (
          <div key={condition.id} className="flex items-center space-x-3 bg-gray-900 p-3 rounded border border-gray-700">
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Indicator</label>
                <select
                  value={condition.left}
                  onChange={(e) => updateCondition(condition.id, 'left', e.target.value)}
                  className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700"
                >
                  <option value="Close">Close</option>
                  <option value="SMA_50">SMA 50</option>
                  <option value="SMA_200">SMA 200</option>
                  <option value="EMA_9">EMA 9</option>
                  <option value="EMA_21">EMA 21</option>
                  <option value="RSI">RSI</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Operator</label>
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(condition.id, 'operator', e.target.value)}
                  className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700"
                >
                  <option value=">">{'>'}</option>
                  <option value="<">{'<'}</option>
                  <option value=">=">{'>='}</option>
                  <option value="<=">{'<='}</option>
                  <option value="==">{'=='}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Value</label>
                <input
                  type="text"
                  value={condition.right}
                  onChange={(e) => updateCondition(condition.id, 'right', e.target.value)}
                  className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            {conditions.length > 1 && (
              <button 
                onClick={() => removeCondition(condition.id)}
                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addCondition}
        className="mt-4 flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        <Plus size={16} />
        <span>Add Condition</span>
      </button>
    </div>
  );
}