/**
 * FloodSense Delhi - Rainfall Chart Component
 * 
 * Displays monthly rainfall data with flood incidents overlay.
 * Uses Recharts for visualization.
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Legend,
} from 'recharts';
import type { MonthlyData } from '@/types/floodData';

interface RainfallChartProps {
  /** Monthly rainfall and incident data */
  data: MonthlyData[];
  /** Chart title */
  title?: string;
  /** Optional height */
  height?: number;
}

/**
 * Custom tooltip component for the chart
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-mono font-medium text-foreground">
            {entry.value} {entry.name === 'Rainfall' ? 'mm' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * RainfallChart - Monthly rainfall visualization with flood incidents
 */
const RainfallChart = ({
  data,
  title = 'Rainfall vs Flood Incidents',
  height = 300,
}: RainfallChartProps) => {
  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Monthly data showing correlation between rainfall and flooding
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            {/* Gradient for rainfall area */}
            <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(199, 89%, 55%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(199, 89%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          
          <YAxis 
            yAxisId="left"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            label={{ 
              value: 'Rainfall (mm)', 
              angle: -90, 
              position: 'insideLeft',
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 11,
            }}
          />
          
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            label={{ 
              value: 'Incidents', 
              angle: 90, 
              position: 'insideRight',
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 11,
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => (
              <span className="text-muted-foreground text-sm">{value}</span>
            )}
          />
          
          {/* Rainfall area */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="rainfall"
            name="Rainfall"
            stroke="hsl(199, 89%, 55%)"
            strokeWidth={2}
            fill="url(#rainfallGradient)"
          />
          
          {/* Flood incidents bars */}
          <Bar
            yAxisId="right"
            dataKey="incidents"
            name="Flood Incidents"
            fill="hsl(var(--risk-critical))"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RainfallChart;
