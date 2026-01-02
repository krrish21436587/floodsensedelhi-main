/**
 * FloodSense Delhi - Delhi Ward GeoJSON Data
 * 
 * Simplified ward boundaries for demonstration purposes.
 * In a production environment, this would be replaced with actual
 * Delhi ward boundary data from Delhi Geoportal or SDAU.
 * 
 * Note: These are approximate boundaries for visualization only.
 */

import type { RiskLevel } from '@/types/floodData';

export interface WardFeature {
  type: 'Feature';
  properties: {
    wardId: string;
    name: string;
    zone: string;
    riskLevel: RiskLevel;
    riskScore: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface WardGeoJSON {
  type: 'FeatureCollection';
  features: WardFeature[];
}

/**
 * Simplified Delhi ward boundaries
 * Real boundaries would have hundreds of coordinate points per ward
 */
export const delhiWardsGeoJSON: WardGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_01',
        name: 'Connaught Place',
        zone: 'Central Delhi',
        riskLevel: 'medium',
        riskScore: 45,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.20, 28.62],
          [77.23, 28.62],
          [77.23, 28.64],
          [77.20, 28.64],
          [77.20, 28.62],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_02',
        name: 'Karol Bagh',
        zone: 'Central Delhi',
        riskLevel: 'high',
        riskScore: 72,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.17, 28.64],
          [77.20, 28.64],
          [77.20, 28.67],
          [77.17, 28.67],
          [77.17, 28.64],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_03',
        name: 'Rohini',
        zone: 'North West Delhi',
        riskLevel: 'low',
        riskScore: 28,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.03, 28.73],
          [77.08, 28.73],
          [77.08, 28.77],
          [77.03, 28.77],
          [77.03, 28.73],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_04',
        name: 'Dwarka',
        zone: 'South West Delhi',
        riskLevel: 'low',
        riskScore: 22,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.02, 28.56],
          [77.08, 28.56],
          [77.08, 28.60],
          [77.02, 28.60],
          [77.02, 28.56],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_05',
        name: 'Mayur Vihar',
        zone: 'East Delhi',
        riskLevel: 'critical',
        riskScore: 88,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.27, 28.58],
          [77.32, 28.58],
          [77.32, 28.61],
          [77.27, 28.61],
          [77.27, 28.58],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_06',
        name: 'Saket',
        zone: 'South Delhi',
        riskLevel: 'medium',
        riskScore: 52,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.18, 28.51],
          [77.23, 28.51],
          [77.23, 28.54],
          [77.18, 28.54],
          [77.18, 28.51],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_07',
        name: 'Punjabi Bagh',
        zone: 'West Delhi',
        riskLevel: 'high',
        riskScore: 68,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.11, 28.66],
          [77.15, 28.66],
          [77.15, 28.69],
          [77.11, 28.69],
          [77.11, 28.66],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_08',
        name: 'Laxmi Nagar',
        zone: 'East Delhi',
        riskLevel: 'critical',
        riskScore: 91,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.26, 28.62],
          [77.30, 28.62],
          [77.30, 28.65],
          [77.26, 28.65],
          [77.26, 28.62],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_09',
        name: 'Vasant Kunj',
        zone: 'South Delhi',
        riskLevel: 'low',
        riskScore: 31,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.13, 28.50],
          [77.18, 28.50],
          [77.18, 28.54],
          [77.13, 28.54],
          [77.13, 28.50],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_10',
        name: 'Shahdara',
        zone: 'North East Delhi',
        riskLevel: 'high',
        riskScore: 75,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.27, 28.66],
          [77.31, 28.66],
          [77.31, 28.70],
          [77.27, 28.70],
          [77.27, 28.66],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_11',
        name: 'Najafgarh',
        zone: 'South West Delhi',
        riskLevel: 'critical',
        riskScore: 85,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.95, 28.59],
          [77.01, 28.59],
          [77.01, 28.63],
          [76.95, 28.63],
          [76.95, 28.59],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        wardId: 'ward_12',
        name: 'Pitampura',
        zone: 'North West Delhi',
        riskLevel: 'medium',
        riskScore: 48,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.11, 28.69],
          [77.16, 28.69],
          [77.16, 28.72],
          [77.11, 28.72],
          [77.11, 28.69],
        ]],
      },
    },
  ],
};
