import { useState, useEffect } from 'react';
import { fetchHistory } from '../services/api';
// import MetricsSummary from './MetricsSummary'; // Might re-integrate later if needed for details view

export default function History() {
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      // Sort by timestamp descending
      data.sort((a: any, b: any) => b.timestamp - a.timestamp);
      setHistoryItems(data);
    } catch (err: any) {
      console.error('Failed to load history', err);
      // setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  // Helper to format date
  const formatDate = (ts: string | number) => {
    const d = new Date(ts);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) return <div className="p-8 text-slate-400">Loading history...</div>;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark h-full">
      <header className="bg-surface-darker border-b border-border-dark px-6 py-5 flex flex-col gap-6 sticky top-0 z-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Strategy Execution History</h2>
            <p className="text-slate-400 text-sm mt-1">Manage and review your past backtest simulations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold text-sm h-[40px] px-4 rounded-lg transition-colors shadow-lg shadow-primary/20 whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Backtest
            </button>
            <button className="flex items-center justify-center h-10 w-10 rounded-lg border border-border-dark text-slate-400 hover:text-white hover:bg-white/5">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center justify-center h-10 w-10 rounded-lg border border-border-dark text-slate-400 hover:text-white hover:bg-white/5">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Filters */}
        <div className="bg-surface-dark border border-border-dark rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="material-symbols-outlined text-slate-500">search</span>
            </div>
            <input
              className="block w-full p-2.5 pl-10 text-sm bg-[#1c1f27] border border-border-dark rounded-lg placeholder-slate-500 text-white focus:ring-primary focus:border-primary focus:outline-none"
              placeholder="Search strategies or tags..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative">
              <select className="appearance-none h-[42px] pl-3 pr-8 rounded-lg border border-border-dark bg-[#1c1f27] text-sm text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                <option>All Strategies</option>
                <option>BTCUSD Scavenger V2</option>
                <option>ETH Trend Follower</option>
                <option>SOL Mean Reversion</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-slate-500 pointer-events-none text-lg">expand_more</span>
            </div>
            <div className="relative">
              <select className="appearance-none h-[42px] pl-3 pr-8 rounded-lg border border-border-dark bg-[#1c1f27] text-sm text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>This Year</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-slate-500 pointer-events-none text-lg">expand_more</span>
            </div>
            <button className="h-[42px] px-4 rounded-lg border border-border-dark text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-darker text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-border-dark">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Strategy Name</th>
                  <th className="px-6 py-4">Date Performed</th>
                  <th className="px-6 py-4">Data Range</th>
                  <th className="px-6 py-4 text-right">Net Profit</th>
                  <th className="px-6 py-4 text-right">Win Rate</th>
                  <th className="px-6 py-4 text-right">Trades</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark text-sm">
                {historyItems.map((item) => {
                  const profit = item.stats.totalProfit;
                  const profitPercent = ((profit / item.initialBalance) * 100);
                  const winRate = item.stats.winRate * 100;
                  const { date, time } = formatDate(item.timestamp);

                  return (
                    <tr key={item.id || Math.random()} className="bg-surface-dark hover:bg-surface-darker transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Completed
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white text-[15px]">{item.fileName || 'Unnamed Strategy'}</span>
                          <span className="text-xs text-slate-500">v1.0 • H1 Timeframe</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {date} <br /> <span className="text-xs text-slate-600">{time}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        Jan 01 - Dec 31, 2024 (Est)
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-medium ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'} text-[15px] tabular-nums`}>
                          {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                        </span>
                        <div className={`text-xs ${profit >= 0 ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                          {profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-white font-medium tabular-nums">{winRate.toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${winRate > 50 ? 'bg-emerald-500' : 'bg-red-500'} rounded-full`}
                              style={{ width: `${winRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-300 tabular-nums">{item.stats.totalTrades}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-60 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="View Results">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Compare">
                            <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
                          </button>
                          <button className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-border-dark flex items-center justify-between bg-[#1c1f27]">
            <p className="text-xs text-slate-400">Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{historyItems.length}</span> of <span className="font-medium text-white">{historyItems.length}</span> runs</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-surface-dark border border-border-dark rounded cursor-not-allowed opacity-50" disabled>Previous</button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-surface-dark border border-border-dark rounded hover:text-white hover:border-slate-500 transition-colors">Next</button>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <p className="text-xs text-slate-500 text-center max-w-lg">
            Backtest results are simulations based on historical data. Past performance is not indicative of future results. <a href="#" className="text-primary hover:underline">Learn more about our data sources</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
