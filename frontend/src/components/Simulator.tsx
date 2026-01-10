import { useState, useRef } from 'react';
import RuleBuilder, { type RuleBuilderHandle } from './RuleBuilder';
import MetricsSummary from './MetricsSummary';
import EquityCurve from './EquityCurve';
import PriceChart from './PriceChart';
import ReturnsHistogram from './ReturnsHistogram';
import { runBacktest, previewCsv } from '../services/api';

export default function Simulator() {
  const entryRuleRef = useRef<RuleBuilderHandle>(null);
  const exitRuleRef = useRef<RuleBuilderHandle>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRandomStrategy = () => {
    entryRuleRef.current?.randomize();
    exitRuleRef.current?.randomize();
  };

  const handleRunBacktest = async () => {
    if (!file) {
      setError("Please upload a CSV file");
      return;
    }

    const entryRule = entryRuleRef.current?.getRule();
    const exitRule = exitRuleRef.current?.getRule();

    if (!entryRule || !exitRule) {
      setError("Invalid rules configuration");
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
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
      {loading && (
        <div className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col space-y-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
          <span className="text-xl font-semibold text-primary">Running Simulation...</span>
        </div>
      )}

      <header className="bg-surface-darker border-b border-border-dark px-6 py-5 flex flex-col gap-6 sticky top-0 z-20 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Backtest Simulator</h2>
            <p className="text-slate-400 text-sm mt-1">Define rules and test your BTCUSD strategy.</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 bg-surface-dark hover:bg-white/5 text-white px-4 py-2.5 rounded-lg font-medium transition-colors border border-border-dark"
            >
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
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
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <div>
              <p className="font-semibold text-red-400">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RuleBuilder title="Entry Rules" ref={entryRuleRef} />
          <RuleBuilder title="Exit Rules" ref={exitRuleRef} />
        </div>

        <div className="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm">
          <div className="max-w-md">
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">Initial Balance ($)</label>
            <div className="flex gap-4">
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(Number(e.target.value))}
                className="flex-1 bg-[#1c1f27] text-white rounded-lg px-3 py-2.5 border border-border-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
              />
              <button
                onClick={handleRandomStrategy}
                type="button"
                className="flex items-center space-x-2 bg-surface-dark hover:bg-white/5 text-slate-300 hover:text-white px-4 py-2.5 rounded-lg font-medium transition-colors border border-border-dark"
              >
                <span className="material-symbols-outlined text-[20px]">shuffle</span>
                <span>Random Strategy</span>
              </button>
              <button
                onClick={handleRunBacktest}
                disabled={loading || !file}
                className="flex items-center space-x-2 bg-primary hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                )}
                <span>{loading ? 'Running...' : 'Run Backtest'}</span>
              </button>
            </div>
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
            <h2 className="text-xl font-bold text-white mb-4">Data Preview</h2>
            <PriceChart
              data={previewData}
              trades={[]}
            />
          </div>
        )}
      </div>
    </div>
  );
}