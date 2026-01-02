/**
 * FloodSense Delhi - Charts Component
 * Rainfall and flood incident visualizations
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
  PieChart,
  Pie,
  Cell,
  BarChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { monthlyRainfallData, zoneRiskData, getRiskColor, allWards } from '@/data/wardData';

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-mono font-medium text-foreground">
            {entry.value}{entry.name === 'Rainfall' ? ' mm' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

// Rainfall vs Incidents Chart
export const RainfallChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monthly Rainfall vs Flood Incidents</CardTitle>
        <p className="text-sm text-muted-foreground">
          Correlation between rainfall and flooding events
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={monthlyRainfallData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
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
            />
            
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="rainfall"
              name="Rainfall"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="url(#rainfallGradient)"
            />
            
            <Bar
              yAxisId="right"
              dataKey="incidents"
              name="Incidents"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Risk Distribution Pie Chart
export const RiskDistributionChart = () => {
  // Calculate risk distribution
  const distribution = allWards.reduce((acc, ward) => {
    acc[ward.riskLevel] = (acc[ward.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'Low Risk', value: distribution.low || 0, level: 'low' },
    { name: 'Medium Risk', value: distribution.medium || 0, level: 'medium' },
    { name: 'High Risk', value: distribution.high || 0, level: 'high' },
    { name: 'Critical Risk', value: distribution.critical || 0, level: 'critical' },
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ward Risk Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          {allWards.length} wards analyzed
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getRiskColor(entry.level)}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
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
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Zone-wise Risk Chart
export const ZoneRiskChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Zone-wise Average Risk</CardTitle>
        <p className="text-sm text-muted-foreground">
          Risk levels across Delhi zones
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={zoneRiskData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <YAxis 
              type="category" 
              dataKey="zone" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="avgRisk" 
              name="Avg Risk Score"
              radius={[0, 4, 4, 0]}
            >
              {zoneRiskData.map((entry, index) => {
                let color = '#22c55e';
                if (entry.avgRisk >= 70) color = '#ef4444';
                else if (entry.avgRisk >= 55) color = '#f97316';
                else if (entry.avgRisk >= 40) color = '#eab308';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
