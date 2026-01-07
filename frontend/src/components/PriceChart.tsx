import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceDot,
  ComposedChart,
  Line
} from 'recharts';

interface PricePoint {
  timestamp: string;
  close: number;
}

interface Trade {
  type: 'BUY' | 'SELL';
  timestamp: string;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
  trades: Trade[];
}

export default function PriceChart({ data, trades }: PriceChartProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(val);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl h-[500px]">
      <h3 className="text-xl font-semibold mb-6 text-blue-400">BTCUSD Price Chart</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9ca3af" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
              }}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              formatter={(value: number) => [formatCurrency(value), 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#6366f1" 
              dot={false}
              strokeWidth={1.5}
            />
            {trades.map((trade, index) => (
              <ReferenceDot
                key={index}
                x={trade.timestamp}
                y={trade.price}
                r={6}
                fill={trade.type === 'BUY' ? '#10b981' : '#ef4444'}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
          <span className="text-gray-400">Buy Order</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
          <span className="text-gray-400">Sell Order</span>
        </div>
      </div>
    </div>
  );
}