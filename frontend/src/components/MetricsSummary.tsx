interface Stats {
  totalProfit: number;
  winRate: number;
  maxDrawdown: number;
  totalTrades: number;
}

interface MetricsSummaryProps {
  stats: Stats;
}

export default function MetricsSummary({ stats }: MetricsSummaryProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  
  const formatPercent = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(val);

  const metrics = [
    { 
      label: 'Net Profit', 
      value: formatCurrency(stats.totalProfit), 
      color: stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400' 
    },
    { 
      label: 'Win Rate', 
      value: formatPercent(stats.winRate), 
      color: 'text-blue-400' 
    },
    { 
      label: 'Max Drawdown', 
      value: formatPercent(stats.maxDrawdown), 
      color: 'text-red-400' 
    },
    { 
      label: 'Total Trades', 
      value: stats.totalTrades.toString(), 
      color: 'text-gray-300' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
          <p className="text-sm text-gray-400 font-medium">{m.label}</p>
          <p className={`text-2xl font-bold mt-1 ${m.color}`}>
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}