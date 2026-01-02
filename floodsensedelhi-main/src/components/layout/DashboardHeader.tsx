/**
 * FloodSense Delhi - Dashboard Header Component
 * 
 * Top navigation bar with branding, search, and status indicators.
 */

import { Droplets, Bell, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  /** Last data update timestamp */
  lastUpdated: string;
  /** Callback to refresh data */
  onRefresh?: () => void;
}

/**
 * DashboardHeader - Main navigation and branding
 */
const DashboardHeader = ({ lastUpdated, onRefresh }: DashboardHeaderProps) => {
  const formattedDate = new Date(lastUpdated).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <header className="bg-primary text-primary-foreground px-6 py-4 shadow-lg">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Droplets className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              FloodSense Delhi
            </h1>
            <p className="text-xs text-primary-foreground/70">
              Smart Water-Logging Hotspot Mapping & Prediction
            </p>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-4">
          {/* Last Updated */}
          <div className="hidden md:block text-right">
            <p className="text-xs text-primary-foreground/70">Last Updated</p>
            <p className="text-sm font-mono">{formattedDate}</p>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-primary-foreground/20 hidden md:block" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={onRefresh}
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-risk-critical rounded-full" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
