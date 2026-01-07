import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RuleBuilder from './components/RuleBuilder';
import MetricsSummary from './components/MetricsSummary';
import EquityCurve from './components/EquityCurve';
import PriceChart from './components/PriceChart';
import ReturnsHistogram from './components/ReturnsHistogram';
import { runBacktest } from './services/api';
import { Play, Loader2 } from 'lucide-react';

function Dashboard() {
  const [entryRule, setEntryRule] = useState<any>(null);
  const [exitRule, setExitRule] = useState<any>(null);
  const [csvPath, setCsvPath] = useState('data.csv');
  const [initialBalance, setInitialBalance] = useState(10000);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunBacktest = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        csvFilePath: csvPath,
        rules: {
          entry: entryRule,
          exit: exitRule
        },
        initialBalance
      };
      const data = await runBacktest(payload);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to run backtest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Backtester POC</h1>
          <p className="text-gray-400">Define rules and test your BTCUSD strategy.</p>
        </div>
        <button
          onClick={handleRunBacktest}
          disabled={loading || !entryRule || !exitRule}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
          <span>{loading ? 'Running...' : 'Run Backtest'}</span>
        </button>
      </header>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RuleBuilder title="Entry Rules" onChange={setEntryRule} />
        <RuleBuilder title="Exit Rules" onChange={setExitRule} />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">CSV Data Path</label>
          <input
            type="text"
            value={csvPath}
            onChange={(e) => setCsvPath(e.target.value)}
            className="w-full bg-gray-900 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="w-48">
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Initial Balance ($)</label>
          <input
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(Number(e.target.value))}
            className="w-full bg-gray-900 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {results && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MetricsSummary stats={results.stats} />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <EquityCurve data={results.equityCurve} />
            <ReturnsHistogram trades={results.trades} />
          </div>

          <PriceChart 
            data={results.equityCurve.map((p: any) => ({ timestamp: p.timestamp, close: p.price }))} 
            trades={results.trades} 
          />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500/30">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
