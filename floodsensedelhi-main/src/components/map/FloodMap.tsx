/**
 * FloodSense Delhi - Interactive Map Component
 * 
 * This component renders an interactive Leaflet map of Delhi showing:
 * - Ward boundaries with color-coded risk levels
 * - Clickable wards for selection
 * - Legend showing risk level colors
 * 
 * Dependencies: react-leaflet, leaflet
 */

import { useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { delhiWardsGeoJSON, type WardFeature } from '@/data/delhiWards';
import { getRiskColor } from '@/data/mockData';
import type { RiskLevel } from '@/types/floodData';

// Delhi center coordinates
const DELHI_CENTER: [number, number] = [28.6139, 77.2090];
const DEFAULT_ZOOM = 11;

interface FloodMapProps {
  /** Currently selected ward ID */
  selectedWardId: string | null;
  /** Callback when a ward is clicked */
  onWardSelect: (wardId: string) => void;
  /** Optional: Show/hide risk overlay */
  showRiskOverlay?: boolean;
}

/**
 * Component to handle map interactions and ward selection
 */
const WardLayer = ({ 
  selectedWardId, 
  onWardSelect 
}: { 
  selectedWardId: string | null; 
  onWardSelect: (wardId: string) => void;
}) => {
  const map = useMap();

  /**
   * Style function for ward polygons
   * Returns different styles based on risk level and selection state
   */
  const style = useCallback((feature: GeoJSON.Feature | undefined): L.PathOptions => {
    if (!feature || !feature.properties) return {};
    
    const { riskLevel, wardId } = feature.properties as WardFeature['properties'];
    const isSelected = wardId === selectedWardId;
    
    return {
      fillColor: getRiskColor(riskLevel),
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
      color: isSelected ? '#1e3a5f' : '#ffffff',
      fillOpacity: isSelected ? 0.7 : 0.5,
      dashArray: isSelected ? '' : '3',
    };
  }, [selectedWardId]);

  /**
   * Highlight ward on hover
   */
  const onEachFeature = useCallback((feature: GeoJSON.Feature, layer: L.Layer) => {
    if (!feature.properties) return;
    
    const { name, zone, riskLevel, riskScore } = feature.properties as WardFeature['properties'];
    
    // Bind popup with ward information
    layer.bindPopup(`
      <div style="padding: 8px;">
        <h3 style="font-weight: bold; font-size: 14px; margin: 0 0 4px 0;">${name}</h3>
        <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${zone}</p>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${getRiskColor(riskLevel)};"></span>
          <span style="font-size: 12px; font-weight: 500;">${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk (${riskScore}%)</span>
        </div>
      </div>
    `);

    // Add hover and click events
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 3,
          color: '#1e3a5f',
          fillOpacity: 0.8,
        });
        target.bringToFront();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        const props = feature.properties as WardFeature['properties'];
        const isSelected = props.wardId === selectedWardId;
        target.setStyle({
          fillColor: getRiskColor(props.riskLevel),
          weight: isSelected ? 3 : 1.5,
          opacity: 1,
          color: isSelected ? '#1e3a5f' : '#ffffff',
          fillOpacity: isSelected ? 0.7 : 0.5,
          dashArray: isSelected ? '' : '3',
        });
      },
      click: () => {
        const props = feature.properties as WardFeature['properties'];
        onWardSelect(props.wardId);
        
        // Get bounds and fly to ward
        const bounds = (layer as L.Polygon).getBounds();
        map.flyToBounds(bounds, { 
          padding: [50, 50],
          duration: 0.5,
        });
      },
    });
  }, [map, onWardSelect, selectedWardId]);

  // Create a unique key based on selectedWardId to force re-render
  const key = useMemo(() => `geojson-${selectedWardId || 'none'}`, [selectedWardId]);

  return (
    <GeoJSON
      key={key}
      data={delhiWardsGeoJSON as GeoJSON.FeatureCollection}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

/**
 * Map Legend Component
 */
const MapLegend = () => {
  const riskLevels: { level: RiskLevel; label: string }[] = [
    { level: 'low', label: 'Low Risk' },
    { level: 'medium', label: 'Medium Risk' },
    { level: 'high', label: 'High Risk' },
    { level: 'critical', label: 'Critical Risk' },
  ];

  return (
    <div className="absolute bottom-6 left-6 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
      <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
        Flood Risk Level
      </h4>
      <div className="space-y-1.5">
        {riskLevels.map(({ level, label }) => (
          <div key={level} className="flex items-center gap-2">
            <span 
              className="w-4 h-4 rounded-sm border border-border/50"
              style={{ backgroundColor: getRiskColor(level) }}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main FloodMap Component
 * Renders the interactive Delhi flood risk map
 */
const FloodMap = ({ 
  selectedWardId, 
  onWardSelect,
  showRiskOverlay = true,
}: FloodMapProps) => {
  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={DELHI_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* Base map layer - OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Ward boundaries with risk coloring */}
        {showRiskOverlay && (
          <WardLayer 
            selectedWardId={selectedWardId} 
            onWardSelect={onWardSelect} 
          />
        )}
      </MapContainer>
      
      {/* Legend overlay */}
      <MapLegend />
      
      {/* Map title */}
      <div className="absolute top-4 left-4 z-[1000] bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
        <h3 className="text-sm font-semibold">Delhi Flood Risk Map</h3>
        <p className="text-xs opacity-80">Click a ward for details</p>
      </div>
    </div>
  );
};

export default FloodMap;
