/**
 * FloodSense Delhi - Ward Selector Component
 * 
 * Dropdown component for selecting a Delhi ward.
 * Displays ward name, zone, and current risk level.
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockWards, getRiskColor } from '@/data/mockData';
import { MapPin } from 'lucide-react';

interface WardSelectorProps {
  /** Currently selected ward ID */
  selectedWardId: string | null;
  /** Callback when ward selection changes */
  onWardChange: (wardId: string) => void;
  /** Optional label */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * WardSelector - Dropdown for Delhi ward selection
 */
const WardSelector = ({
  selectedWardId,
  onWardChange,
  label = 'Select Ward',
  className,
}: WardSelectorProps) => {
  return (
    <div className={className}>
      {/* Optional label */}
      {label && (
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {label}
        </label>
      )}
      
      <Select
        value={selectedWardId || undefined}
        onValueChange={onWardChange}
      >
        <SelectTrigger className="w-full bg-card border-border">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <SelectValue placeholder="Choose a ward to view details" />
          </div>
        </SelectTrigger>
        
        <SelectContent>
          {mockWards.map((ward) => (
            <SelectItem 
              key={ward.id} 
              value={ward.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 py-1">
                {/* Risk indicator */}
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getRiskColor(ward.riskLevel) }}
                />
                
                {/* Ward info */}
                <div className="flex flex-col">
                  <span className="font-medium">{ward.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {ward.zone} • Risk Score: {ward.riskScore}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WardSelector;
