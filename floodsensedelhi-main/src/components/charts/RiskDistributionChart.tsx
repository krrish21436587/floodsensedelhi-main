/**
 * FloodSense Delhi - Risk Distribution Chart
 * 
 * Pie chart showing distribution of wards by risk level.
 */

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { mockWards, getRiskColor } from '@/data/mockData';
import type { RiskLevel } from '@/types/floodData';

interface RiskDistributionChartProps {
  /** Chart height */
  height?: number;
}

/**
 * Custom label for pie segments
 */
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.1) return null; // Don't show label for small segments

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="font-semibold text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * RiskDistributionChart - Shows ward distribution by risk level
 */
const RiskDistributionChart = ({ height = 280 }: RiskDistributionChartProps) => {
  // Calculate distribution
  const distribution = mockWards.reduce((acc, ward) => {
    acc[ward.riskLevel] = (acc[ward.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<RiskLevel, number>);

  const data = [
    { name: 'Low Risk', value: distribution.low || 0, level: 'low' as RiskLevel },
    { name: 'Medium Risk', value: distribution.medium || 0, level: 'medium' as RiskLevel },
    { name: 'High Risk', value: distribution.high || 0, level: 'high' as RiskLevel },
    { name: 'Critical Risk', value: distribution.critical || 0, level: 'critical' as RiskLevel },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-foreground">Ward Risk Distribution</h3>
        <p className="text-sm text-muted-foreground">
          {mockWards.length} wards analyzed
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={90}
            innerRadius={40}
            dataKey="value"
            stroke="hsl(var(--background))"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getRiskColor(entry.level)}
              />
            ))}
          </Pie>
          
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-semibold text-foreground">{data.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.value} ward{data.value !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            }}
          />
          
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => (
              <span className="text-muted-foreground text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskDistributionChart;
