/**
 * FloodSense Delhi - Main Dashboard Page
 * Responsive dashboard with map, charts, and AI-powered prediction
 */

import { useState } from 'react';
import { MapPin, AlertTriangle, Droplets, TrendingUp, Menu, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { RainfallChart, RiskDistributionChart, ZoneRiskChart } from '@/components/Charts';
import DelhiMap from '@/components/DelhiMap';
import PredictionForm from '@/components/PredictionForm';
import HistoricalTimeline from '@/components/HistoricalTimeline';
import WeatherForecast from '@/components/WeatherForecast';
import ExportPanel from '@/components/ExportPanel';
import EmergencyContacts from '@/components/EmergencyContacts';
import IncidentReportForm from '@/components/IncidentReportForm';
import CommunityReports from '@/components/CommunityReports';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { allWards, getRiskColor } from '@/data/wardData';
import { exportSelectedWard } from '@/utils/exportUtils';

const zones = [...new Set(allWards.map(w => w.zone))].sort();

const Dashboard = () => {
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedWard = allWards.find(w => w.id === selectedWardId);

  const filteredWards = allWards.filter(ward => {
    const matchesSearch = ward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ward.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === 'all' || ward.zone === zoneFilter;
    const matchesRisk = riskFilter === 'all' || ward.riskLevel === riskFilter;
    return matchesSearch && matchesZone && matchesRisk;
  });

  const highRiskCount = allWards.filter(w => w.riskLevel === 'high' || w.riskLevel === 'critical').length;
  const avgRiskScore = Math.round(allWards.reduce((a, w) => a + w.riskScore, 0) / allWards.length);
  const totalIncidents = allWards.reduce((a, w) => a + w.incidents, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Droplets className="w-6 h-6 sm:w-8 sm:h-8" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold">FloodSense Delhi</h1>
              <p className="text-xs sm:text-sm opacity-80 hidden sm:block">Smart Water-Logging Mapping • {allWards.length} Wards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 px-2 py-1 rounded hidden sm:inline">
              {allWards.length} Wards
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:p-6 flex items-center gap-2 sm:gap-3">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{allWards.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Wards</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:p-6 flex items-center gap-2 sm:gap-3">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" style={{color: '#ef4444'}} />
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{highRiskCount}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">High Risk</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:p-6 flex items-center gap-2 sm:gap-3">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" style={{color: '#eab308'}} />
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{avgRiskScore}%</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg Risk</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:p-6 flex items-center gap-2 sm:gap-3">
              <Droplets className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" style={{color: '#38bdf8'}} />
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{totalIncidents}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Incidents</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Forecast */}
        <WeatherForecast />

        {/* Map and Prediction - Responsive Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-2 h-[300px] sm:h-[400px] lg:h-[500px] relative overflow-hidden">
            <DelhiMap selectedWardId={selectedWardId} onWardSelect={setSelectedWardId} />
          </Card>
          <div className="space-y-4 sm:space-y-6">
            <PredictionForm />
            <div className="hidden lg:block">
              <ExportPanel />
            </div>
          </div>
        </div>

        {/* Mobile Export Panel */}
        <div className="lg:hidden">
          <ExportPanel />
        </div>

        {/* Ward List and Details - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="h-[400px] sm:h-[500px] flex flex-col">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">All Wards ({filteredWards.length})</CardTitle>
              <Input 
                placeholder="Search wards..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="mt-2 text-sm" 
              />
              <div className="flex gap-2 mt-2">
                <Select value={zoneFilter} onValueChange={setZoneFilter}>
                  <SelectTrigger className="flex-1 text-xs sm:text-sm">
                    <SelectValue placeholder="Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-24 sm:w-28 text-xs sm:text-sm">
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full px-3 sm:px-4 pb-4">
                {filteredWards.map(ward => (
                  <div 
                    key={ward.id} 
                    onClick={() => setSelectedWardId(ward.id)}
                    className={`p-2 sm:p-3 rounded-lg border mb-2 cursor-pointer transition-colors ${
                      selectedWardId === ward.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm truncate">{ward.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{ward.zone}</p>
                      </div>
                      <span 
                        className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-white flex-shrink-0" 
                        style={{backgroundColor: getRiskColor(ward.riskLevel)}}
                      >
                        {ward.riskScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="h-[400px] sm:h-[500px]">
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Ward Details</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {selectedWard ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold truncate">{selectedWard.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedWard.zone}</p>
                    </div>
                    <span 
                      className="px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm flex-shrink-0" 
                      style={{backgroundColor: getRiskColor(selectedWard.riskLevel)}}
                    >
                      {selectedWard.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{width: `${selectedWard.riskScore}%`, backgroundColor: getRiskColor(selectedWard.riskLevel)}} 
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {[
                      {label: 'Risk Score', value: `${selectedWard.riskScore}%`},
                      {label: 'Population', value: `${(selectedWard.population/1000).toFixed(0)}K`},
                      {label: 'Area', value: `${selectedWard.area} km²`},
                      {label: 'Rainfall', value: `${selectedWard.avgRainfall} mm`},
                      {label: 'Incidents', value: selectedWard.incidents},
                      {label: 'Coords', value: `${selectedWard.coordinates[0].toFixed(2)}°N`},
                    ].map(({label, value}) => (
                      <div key={label} className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{label}</p>
                        <p className="font-bold font-mono text-xs sm:text-base">{value}</p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 sm:mt-3 gap-2 text-xs sm:text-sm"
                    onClick={() => exportSelectedWard(selectedWard)}
                  >
                    <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Export Report
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-30" />
                  <p className="text-sm">Select a ward to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Community Reporting - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <IncidentReportForm />
          <CommunityReports />
        </div>

        {/* Emergency Contacts */}
        <EmergencyContacts selectedWard={selectedWard} />

        {/* Historical Timeline */}
        <HistoricalTimeline />

        {/* Charts - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <RainfallChart />
          <RiskDistributionChart />
        </div>
        <ZoneRiskChart />
      </main>

      <footer className="border-t py-3 sm:py-4 text-center text-xs sm:text-sm text-muted-foreground">
        FloodSense Delhi • {allWards.length} Wards • {zones.length} Zones
      </footer>
    </div>
  );
};

export default Dashboard;
