import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Trade {
  profit: number;
}

interface ReturnsHistogramProps {
  trades: Trade[];
}

export default function ReturnsHistogram({ trades }: ReturnsHistogramProps) {
  const data = useMemo(() => {
    if (trades.length === 0) return [];

    const profits = trades.map(t => t.profit);
    const min = Math.min(...profits);
    const max = Math.max(...profits);
    const binCount = 10;
    const binSize = (max - min) / binCount || 1;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      name: `${(min + i * binSize).toFixed(0)} to ${(min + (i + 1) * binSize).toFixed(0)}`,
      count: 0,
      center: min + (i + 0.5) * binSize
    }));

    trades.forEach(trade => {
      let binIndex = Math.floor((trade.profit - min) / binSize);
      if (binIndex === binCount) binIndex--;
      if (bins[binIndex]) bins[binIndex].count++;
    });

    return bins;
  }, [trades]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl h-[400px]">
      <h3 className="text-xl font-semibold mb-6 text-blue-400">Distribution of Returns</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              cursor={{ fill: '#374151', opacity: 0.4 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.center >= 0 ? '#10b981' : '#ef4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}