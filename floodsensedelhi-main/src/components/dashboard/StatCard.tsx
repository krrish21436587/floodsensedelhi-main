/**
 * FloodSense Delhi - Statistics Card Component
 * 
 * Reusable card component for displaying key metrics
 * with icon, value, and optional trend indicator.
 */

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  /** Card title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Icon background color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** Optional trend percentage */
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * StatCard - Dashboard statistics card
 * Displays a metric with icon and optional trend indicator
 */
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  className,
}: StatCardProps) => {
  // Variant styles for icon background using inline styles for reliability
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
      case 'warning':
        return { background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' };
      case 'danger':
        return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      case 'info':
        return { background: 'rgba(45, 164, 160, 0.1)', color: '#2da4a0' };
      default:
        return { background: 'rgba(30, 58, 95, 0.1)', color: '#1e3a5f' };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className={cn(
      'bg-card rounded-xl p-5 border border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      className
    )}>
      {/* Header with icon */}
      <div className="flex items-start justify-between mb-3">
        <div 
          className="p-2.5 rounded-lg"
          style={variantStyles}
        >
          <Icon className="w-5 h-5" style={{ color: variantStyles.color }} />
        </div>
        
        {/* Trend indicator */}
        {trend && (
          <div 
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: trend.direction === 'up' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: trend.direction === 'up' ? '#ef4444' : '#22c55e',
            }}
          >
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className="text-2xl font-bold text-foreground font-mono">
          {value}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-muted-foreground">
        {title}
      </h3>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
