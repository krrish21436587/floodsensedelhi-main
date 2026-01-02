/**
 * FloodSense Delhi - Interactive Leaflet Map with Heatmap
 * Displays Delhi wards with risk-colored markers and toggleable incident heatmap
 */

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { allWards, getRiskColor, type Ward } from '@/data/wardData';
import { Button } from '@/components/ui/button';
import { Flame, FlameKindling } from 'lucide-react';

interface DelhiMapProps {
  selectedWardId: string | null;
  onWardSelect: (wardId: string) => void;
}

const DelhiMap = ({ selectedWardId, onWardSelect }: DelhiMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const heatLayerRef = useRef<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([28.6139, 77.2090], 11);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add ward markers
    allWards.forEach(ward => {
      const marker = L.circleMarker([ward.coordinates[0], ward.coordinates[1]], {
        radius: 10,
        color: '#fff',
        weight: 2,
        fillColor: getRiskColor(ward.riskLevel),
        fillOpacity: 0.9,
      }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 4px;">
          <h3 style="font-weight: bold; font-size: 14px; margin: 0;">${ward.name}</h3>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">${ward.zone}</p>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${getRiskColor(ward.riskLevel)};"></span>
            <span style="font-size: 12px;">${ward.riskLevel.toUpperCase()} (${ward.riskScore}%)</span>
          </div>
          <p style="font-size: 11px; color: #888; margin-top: 4px;">${ward.incidents} flood incidents</p>
        </div>
      `);

      marker.on('click', () => onWardSelect(ward.id));
      markersRef.current.set(ward.id, marker);
    });

    // Create heatmap layer
    const heatData: [number, number, number][] = allWards.map(ward => [
      ward.coordinates[0],
      ward.coordinates[1],
      ward.incidents / 25
    ]);

    heatLayerRef.current = (L as any).heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 12,
      max: 1.0,
      gradient: { 0.2: '#22c55e', 0.4: '#eab308', 0.6: '#f97316', 0.8: '#ef4444', 1.0: '#dc2626' }
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onWardSelect]);

  // Toggle heatmap visibility
  useEffect(() => {
    if (!mapRef.current || !heatLayerRef.current) return;
    
    if (showHeatmap) {
      heatLayerRef.current.addTo(mapRef.current);
    } else {
      mapRef.current.removeLayer(heatLayerRef.current);
    }
  }, [showHeatmap]);

  // Fly to selected ward and highlight
  useEffect(() => {
    if (!mapRef.current) return;

    // Reset all markers
    markersRef.current.forEach((marker, id) => {
      const ward = allWards.find(w => w.id === id);
      if (ward) {
        marker.setStyle({
          radius: 10,
          color: '#fff',
          weight: 2,
        });
      }
    });

    // Highlight selected
    if (selectedWardId) {
      const marker = markersRef.current.get(selectedWardId);
      const ward = allWards.find(w => w.id === selectedWardId);
      if (marker && ward) {
        marker.setStyle({ radius: 14, color: '#1e3a5f', weight: 3 });
        marker.bringToFront();
        mapRef.current.flyTo([ward.coordinates[0], ward.coordinates[1]], 13, { duration: 0.8 });
      }
    }
  }, [selectedWardId]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-border">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Heatmap Toggle */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Button
          variant={showHeatmap ? "default" : "outline"}
          size="sm"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="gap-2"
        >
          {showHeatmap ? <Flame className="w-4 h-4" /> : <FlameKindling className="w-4 h-4" />}
          {showHeatmap ? 'Hide' : 'Show'} Heatmap
        </Button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
        <h4 className="text-xs font-semibold mb-2">Risk Level</h4>
        <div className="space-y-1">
          {(['low', 'medium', 'high', 'critical'] as const).map(level => (
            <div key={level} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor(level) }} />
              <span className="text-xs capitalize">{level}</span>
            </div>
          ))}
        </div>
        {showHeatmap && (
          <div className="border-t border-border mt-2 pt-2">
            <p className="text-xs text-muted-foreground">Heatmap: Incident density</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DelhiMap;
