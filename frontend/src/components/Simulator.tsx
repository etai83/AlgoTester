import { useState, useRef } from 'react';
import RuleBuilder from './RuleBuilder';
import MetricsSummary from './MetricsSummary';
import EquityCurve from './EquityCurve';
import PriceChart from './PriceChart';
import ReturnsHistogram from './ReturnsHistogram';
import { runBacktest, previewCsv } from '../services/api';
import { Play, Loader2, Upload } from 'lucide-react';

function Simulator() {
  const [entryRule, setEntryRule] = useState<any>(null);
  const [exitRule, setExitRule] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRunBacktest = async () => {
    if (!file) {
      setError("Please upload a CSV file");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        file,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResults(null);
      setPreviewData(null);
      setError(null);
      
      try {
        const data = await previewCsv(selectedFile);
        setPreviewData(data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Failed to preview CSV');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Simulator</h2>
          <p className="text-gray-400">Define rules and test your BTCUSD strategy.</p>
        </div>
        <div className="flex space-x-4">
           <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors border border-gray-600"
          >
            <Upload size={20} />
            <span>{file ? file.name : 'Upload CSV'}</span>
          </button>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>
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

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl flex items-center">
        <div className="w-48">
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Initial Balance ($)</label>
          <input
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(Number(e.target.value))}
            className="w-full bg-gray-900 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleRunBacktest}
            disabled={loading || !entryRule || !exitRule || !file}
            className="mt-4 w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            <span>{loading ? 'Running...' : 'Run Backtest'}</span>
          </button>
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

      {previewData && !results && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h2 className="text-2xl font-bold text-white mb-4">Data Preview</h2>
           <PriceChart 
            data={previewData} 
            trades={[]} 
          />
        </div>
      )}
    </div>
  );
}

export default Simulator;
