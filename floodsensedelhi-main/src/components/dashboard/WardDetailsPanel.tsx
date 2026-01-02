/**
 * FloodSense Delhi - Ward Details Panel
 * 
 * Displays detailed statistics for a selected ward including
 * risk factors, historical data, and recommendations.
 */

import { mockWards, mockWardStatistics } from '@/data/mockData';
import RiskBadge from './RiskBadge';
import { 
  Droplets, 
  Mountain, 
  Building2, 
  Calendar,
  TrendingUp,
  Users,
  MapPin,
} from 'lucide-react';

interface WardDetailsPanelProps {
  /** ID of the ward to display */
  wardId: string | null;
}

/**
 * DetailItem - Helper component for displaying a metric
 */
const DetailItem = ({ 
  icon: Icon, 
  label, 
  value, 
  unit = '',
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
  unit?: string;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
    <div className="p-2 rounded-lg" style={{ background: 'rgba(30, 58, 95, 0.1)' }}>
      <Icon className="w-4 h-4" style={{ color: '#1e3a5f' }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground font-mono">
        {value}{unit}
      </p>
    </div>
  </div>
);

/**
 * WardDetailsPanel - Detailed view of selected ward
 */
const WardDetailsPanel = ({ wardId }: WardDetailsPanelProps) => {
  // Find ward and statistics
  const ward = wardId ? mockWards.find(w => w.id === wardId) : null;
  const stats = wardId ? mockWardStatistics[wardId] : null;

  // Empty state
  if (!ward || !stats) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border h-full flex flex-col items-center justify-center text-center min-h-[300px]">
        <MapPin className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Select a Ward
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Click on a ward in the map or use the dropdown to view detailed flood risk information
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{ward.name}</h3>
          <p className="text-sm text-muted-foreground">{ward.zone}</p>
        </div>
        <RiskBadge level={ward.riskLevel} size="md" animated />
      </div>

      {/* Risk Score Gauge */}
      <div className="mb-5 p-4 rounded-lg bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Overall Risk Score
          </span>
          <span className="text-3xl font-bold font-mono text-foreground">
            {ward.riskScore}
            <span className="text-lg text-muted-foreground">/100</span>
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${ward.riskScore}%`,
              background: 'linear-gradient(90deg, #22c55e 0%, #eab308 40%, #f97316 70%, #ef4444 100%)'
            }}
          />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <DetailItem 
          icon={Users}
          label="Population"
          value={ward.population.toLocaleString()}
        />
        <DetailItem 
          icon={Building2}
          label="Area"
          value={ward.area}
          unit=" km²"
        />
        <DetailItem 
          icon={Droplets}
          label="Avg. Rainfall"
          value={stats.avgRainfall}
          unit=" mm/yr"
        />
        <DetailItem 
          icon={Mountain}
          label="Elevation"
          value={stats.elevation}
          unit=" m"
        />
        <DetailItem 
          icon={TrendingUp}
          label="Total Incidents"
          value={stats.totalIncidents}
        />
        <DetailItem 
          icon={Calendar}
          label="Last Flood"
          value={stats.lastFloodDate ? 
            new Date(stats.lastFloodDate).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            }) : 'N/A'}
        />
      </div>

      {/* Infrastructure Score */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Drainage Infrastructure Score
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${stats.drainageDensity * 100}%`,
                backgroundColor: '#2da4a0'
              }}
            />
          </div>
          <span className="text-sm font-mono text-muted-foreground">
            {(stats.drainageDensity * 100).toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Higher score indicates better drainage capacity
        </p>
      </div>

      {/* Impervious Surface */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Impervious Surface Coverage
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${stats.imperviousSurface}%`,
                backgroundColor: '#f97316'
              }}
            />
          </div>
          <span className="text-sm font-mono text-muted-foreground">
            {stats.imperviousSurface}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Higher coverage means less water absorption
        </p>
      </div>
    </div>
  );
};

export default WardDetailsPanel;
