/**
 * FloodSense Delhi - Risk Badge Component
 * 
 * Displays a color-coded badge indicating flood risk level.
 * Used throughout the dashboard for quick visual identification.
 */

import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types/floodData';

interface RiskBadgeProps {
  /** Risk level to display */
  level: RiskLevel;
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show pulse animation for critical/high risk */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Risk level colors
const riskColors: Record<RiskLevel, { bg: string; text: string; border: string; dot: string }> = {
  low: { 
    bg: 'rgba(34, 197, 94, 0.15)', 
    text: '#16a34a', 
    border: 'rgba(34, 197, 94, 0.3)',
    dot: '#22c55e',
  },
  medium: { 
    bg: 'rgba(234, 179, 8, 0.15)', 
    text: '#ca8a04', 
    border: 'rgba(234, 179, 8, 0.3)',
    dot: '#eab308',
  },
  high: { 
    bg: 'rgba(249, 115, 22, 0.15)', 
    text: '#ea580c', 
    border: 'rgba(249, 115, 22, 0.3)',
    dot: '#f97316',
  },
  critical: { 
    bg: 'rgba(239, 68, 68, 0.15)', 
    text: '#dc2626', 
    border: 'rgba(239, 68, 68, 0.3)',
    dot: '#ef4444',
  },
};

// Risk level labels
const levelLabels: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical Risk',
};

/**
 * RiskBadge - Visual indicator for flood risk levels
 */
const RiskBadge = ({
  level,
  size = 'md',
  animated = false,
  className,
}: RiskBadgeProps) => {
  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const colors = riskColors[level];
  const shouldAnimate = animated && (level === 'critical' || level === 'high');

  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        sizeClasses[size],
        shouldAnimate && 'animate-pulse',
        className
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {/* Risk indicator dot */}
      <span 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: colors.dot }}
      />
      {levelLabels[level]}
    </span>
  );
};

export default RiskBadge;
