/**
 * FloodSense Delhi - Historical Flood Timeline
 * Displays flood incidents over time with interactive slider
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Historical flood data by year and month
const historicalData = [
  { year: 2018, months: [0, 0, 1, 2, 3, 12, 28, 22, 15, 4, 1, 0] },
  { year: 2019, months: [0, 1, 0, 1, 4, 15, 32, 25, 18, 5, 0, 0] },
  { year: 2020, months: [0, 0, 2, 1, 2, 10, 24, 20, 12, 3, 1, 0] },
  { year: 2021, months: [1, 0, 1, 2, 5, 18, 35, 30, 20, 6, 1, 0] },
  { year: 2022, months: [0, 1, 0, 3, 4, 14, 30, 28, 16, 4, 0, 1] },
  { year: 2023, months: [0, 0, 1, 2, 6, 20, 38, 32, 22, 7, 2, 0] },
  { year: 2024, months: [1, 0, 2, 1, 5, 16, 34, 26, 19, 5, 1, 0] },
];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const HistoricalTimeline = () => {
  const [selectedYearIndex, setSelectedYearIndex] = useState(historicalData.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedYear = historicalData[selectedYearIndex];
  
  const chartData = useMemo(() => 
    monthNames.map((month, i) => ({
      month,
      incidents: selectedYear.months[i],
      rainfall: [15, 18, 22, 28, 45, 180, 280, 250, 150, 35, 12, 10][i] + (Math.random() * 30 - 15)
    })), [selectedYear]
  );

  const totalIncidents = selectedYear.months.reduce((a, b) => a + b, 0);
  const peakMonth = monthNames[selectedYear.months.indexOf(Math.max(...selectedYear.months))];

  // Animation effect
  useMemo(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setSelectedYearIndex(prev => {
        if (prev >= historicalData.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Historical Flood Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedYearIndex(0);
                setIsPlaying(true);
              }}
              disabled={isPlaying}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Playing' : 'Play Timeline'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Year Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Year</span>
            <span className="font-bold text-lg">{selectedYear.year}</span>
          </div>
          <Slider
            value={[selectedYearIndex]}
            onValueChange={(v) => setSelectedYearIndex(v[0])}
            max={historicalData.length - 1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {historicalData.map((d, i) => (
              <span 
                key={d.year} 
                className={i === selectedYearIndex ? 'font-bold text-primary' : ''}
              >
                {d.year}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{totalIncidents}</p>
            <p className="text-xs text-muted-foreground">Total Incidents</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{peakMonth}</p>
            <p className="text-xs text-muted-foreground">Peak Month</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{Math.max(...selectedYear.months)}</p>
            <p className="text-xs text-muted-foreground">Max Incidents</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <ReferenceLine x="Jul" stroke="#f97316" strokeDasharray="5 5" label={{ value: 'Monsoon Peak', fontSize: 10 }} />
              <Area 
                type="monotone" 
                dataKey="incidents" 
                stroke="#ef4444" 
                fill="url(#incidentGradient)"
                strokeWidth={2}
                name="Flood Incidents"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Showing monthly flood incidents for {selectedYear.year} • Monsoon season (Jun-Sep) shows highest activity
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoricalTimeline;
