import { useState, useEffect } from 'react';
import { fetchHistory } from '../services/api';
import MetricsSummary from './MetricsSummary';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      // Sort by timestamp descending
      data.sort((a: any, b: any) => b.timestamp - a.timestamp);
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <div className="text-center text-gray-400 mt-8">Loading history...</div>;
  }

  if (error) {
    return <div className="text-red-400 mt-8">Error: {error}</div>;
  }

  if (history.length === 0) {
      return <div className="text-center text-gray-400 mt-8">No history found. Run a simulation to see it here.</div>;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-white mb-6">Simulation History</h2>
      {history.map((item) => (
        <div key={item.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750 transition-colors"
            onClick={() => toggleExpand(item.id)}
          >
            <div className="flex items-center space-x-6">
                <div className="text-gray-400 flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                {item.fileName && (
                   <div className="text-gray-400 text-sm border-l border-gray-600 pl-4 h-5 flex items-center">
                       {item.fileName}
                   </div>
                )}
                <div className={`font-semibold ${item.stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.stats.totalProfit >= 0 ? '+' : ''}{item.stats.totalProfit.toFixed(2)} ({((item.stats.totalProfit / item.initialBalance) * 100).toFixed(2)}%)
                </div>
                <div className="text-gray-300">
                    Win Rate: {(item.stats.winRate * 100).toFixed(1)}%
                </div>
                 <div className="text-gray-300">
                    Trades: {item.stats.totalTrades}
                </div>
            </div>
            <div>
                {expandedId === item.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </div>
          </div>
          
          {expandedId === item.id && (
            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                <div className="mb-4">
                     <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Detailed Metrics</h4>
                     <MetricsSummary stats={item.stats} />
                </div>
                {/* We could add more details here, like the rules used */}
                 <div>
                     <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Strategy Rules</h4>
                     <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                         <div className="bg-gray-800 p-3 rounded">
                             <span className="text-blue-400 block mb-1">Entry</span>
                             <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(item.rules.entry, null, 2)}</pre>
                         </div>
                         <div className="bg-gray-800 p-3 rounded">
                             <span className="text-purple-400 block mb-1">Exit</span>
                             <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(item.rules.exit, null, 2)}</pre>
                         </div>
                     </div>
                 </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default History;
