/**
 * FloodSense Delhi - Mock Data Service
 * 
 * This file contains simulated data that mimics what would come from a real
 * backend API. In a production environment, these would be replaced with
 * actual API calls to the FastAPI backend.
 * 
 * DATA SOURCES (for a real implementation):
 * - Delhi ward boundaries: Delhi Geoportal / SDAU
 * - Rainfall data: IMD (India Meteorological Department)
 * - Flood history: MCD (Municipal Corporation of Delhi) / DDMA
 * - Elevation data: SRTM/ASTER DEM
 */

import type {
  Ward,
  WardStatistics,
  FloodIncident,
  DashboardSummary,
  MonthlyData,
  RiskLevel,
  Coordinates,
} from '@/types/floodData';

/**
 * Delhi wards mock data
 * Real data would come from GET /api/wards endpoint
 */
export const mockWards: Ward[] = [
  {
    id: 'ward_01',
    name: 'Connaught Place',
    zone: 'Central Delhi',
    population: 182000,
    area: 4.5,
    coordinates: { lat: 28.6315, lng: 77.2167 },
    riskLevel: 'medium',
    riskScore: 45,
  },
  {
    id: 'ward_02',
    name: 'Karol Bagh',
    zone: 'Central Delhi',
    population: 156000,
    area: 3.8,
    coordinates: { lat: 28.6519, lng: 77.1909 },
    riskLevel: 'high',
    riskScore: 72,
  },
  {
    id: 'ward_03',
    name: 'Rohini',
    zone: 'North West Delhi',
    population: 245000,
    area: 8.2,
    coordinates: { lat: 28.7495, lng: 77.0565 },
    riskLevel: 'low',
    riskScore: 28,
  },
  {
    id: 'ward_04',
    name: 'Dwarka',
    zone: 'South West Delhi',
    population: 312000,
    area: 12.5,
    coordinates: { lat: 28.5823, lng: 77.0500 },
    riskLevel: 'low',
    riskScore: 22,
  },
  {
    id: 'ward_05',
    name: 'Mayur Vihar',
    zone: 'East Delhi',
    population: 198000,
    area: 5.6,
    coordinates: { lat: 28.5921, lng: 77.2932 },
    riskLevel: 'critical',
    riskScore: 88,
  },
  {
    id: 'ward_06',
    name: 'Saket',
    zone: 'South Delhi',
    population: 167000,
    area: 6.2,
    coordinates: { lat: 28.5244, lng: 77.2066 },
    riskLevel: 'medium',
    riskScore: 52,
  },
  {
    id: 'ward_07',
    name: 'Punjabi Bagh',
    zone: 'West Delhi',
    population: 189000,
    area: 4.8,
    coordinates: { lat: 28.6714, lng: 77.1304 },
    riskLevel: 'high',
    riskScore: 68,
  },
  {
    id: 'ward_08',
    name: 'Laxmi Nagar',
    zone: 'East Delhi',
    population: 223000,
    area: 4.2,
    coordinates: { lat: 28.6304, lng: 77.2783 },
    riskLevel: 'critical',
    riskScore: 91,
  },
  {
    id: 'ward_09',
    name: 'Vasant Kunj',
    zone: 'South Delhi',
    population: 145000,
    area: 9.8,
    coordinates: { lat: 28.5195, lng: 77.1565 },
    riskLevel: 'low',
    riskScore: 31,
  },
  {
    id: 'ward_10',
    name: 'Shahdara',
    zone: 'North East Delhi',
    population: 276000,
    area: 5.5,
    coordinates: { lat: 28.6731, lng: 77.2893 },
    riskLevel: 'high',
    riskScore: 75,
  },
  {
    id: 'ward_11',
    name: 'Najafgarh',
    zone: 'South West Delhi',
    population: 198000,
    area: 15.2,
    coordinates: { lat: 28.6092, lng: 76.9798 },
    riskLevel: 'critical',
    riskScore: 85,
  },
  {
    id: 'ward_12',
    name: 'Pitampura',
    zone: 'North West Delhi',
    population: 167000,
    area: 5.1,
    coordinates: { lat: 28.7041, lng: 77.1329 },
    riskLevel: 'medium',
    riskScore: 48,
  },
];

/**
 * Monthly rainfall and incident data for charts
 * Simulates monsoon season patterns (June-September peak)
 */
const generateMonthlyData = (wardId: string): MonthlyData[] => {
  // Base patterns - monsoon months have higher rainfall
  const baseRainfall = [15, 18, 22, 28, 45, 180, 250, 230, 150, 35, 12, 10];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Add some variation based on ward ID for realism
  const variation = parseInt(wardId.split('_')[1]) * 5;
  
  return months.map((month, index) => ({
    month,
    rainfall: Math.round(baseRainfall[index] + (Math.random() * variation) - variation/2),
    incidents: index >= 5 && index <= 8 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2),
  }));
};

/**
 * Ward statistics - detailed data for each ward
 */
export const mockWardStatistics: Record<string, WardStatistics> = Object.fromEntries(
  mockWards.map(ward => [
    ward.id,
    {
      wardId: ward.id,
      totalIncidents: Math.floor(Math.random() * 30) + 5,
      avgRainfall: Math.floor(Math.random() * 200) + 700,
      drainageDensity: Math.round((Math.random() * 0.5 + 0.3) * 100) / 100,
      elevation: Math.floor(Math.random() * 30) + 210,
      imperviousSurface: Math.floor(Math.random() * 40) + 40,
      lastFloodDate: ward.riskLevel === 'critical' 
        ? '2024-08-15' 
        : ward.riskLevel === 'high' 
          ? '2024-07-22' 
          : '2023-09-10',
      monthlyRainfall: generateMonthlyData(ward.id),
    },
  ])
);

/**
 * Historical flood incidents
 */
export const mockFloodIncidents: FloodIncident[] = [
  {
    id: 'inc_001',
    wardId: 'ward_08',
    date: '2024-08-15',
    severity: 'critical',
    waterLevel: 85,
    duration: 12,
    affectedArea: 2.5,
    casualties: 0,
    damageEstimate: 450,
  },
  {
    id: 'inc_002',
    wardId: 'ward_05',
    date: '2024-08-12',
    severity: 'critical',
    waterLevel: 92,
    duration: 18,
    affectedArea: 3.2,
    casualties: 0,
    damageEstimate: 680,
  },
  {
    id: 'inc_003',
    wardId: 'ward_02',
    date: '2024-07-28',
    severity: 'high',
    waterLevel: 55,
    duration: 8,
    affectedArea: 1.8,
    casualties: 0,
    damageEstimate: 220,
  },
  {
    id: 'inc_004',
    wardId: 'ward_10',
    date: '2024-07-22',
    severity: 'high',
    waterLevel: 62,
    duration: 10,
    affectedArea: 2.1,
    casualties: 0,
    damageEstimate: 310,
  },
  {
    id: 'inc_005',
    wardId: 'ward_11',
    date: '2024-08-05',
    severity: 'critical',
    waterLevel: 78,
    duration: 14,
    affectedArea: 4.5,
    casualties: 0,
    damageEstimate: 520,
  },
];

/**
 * Dashboard summary statistics
 */
export const mockDashboardSummary: DashboardSummary = {
  totalWards: mockWards.length,
  wardsAtRisk: mockWards.filter(w => w.riskLevel === 'high' || w.riskLevel === 'critical').length,
  totalIncidents: mockFloodIncidents.length,
  avgRiskScore: Math.round(mockWards.reduce((acc, w) => acc + w.riskScore, 0) / mockWards.length),
  lastUpdated: new Date().toISOString(),
};

/**
 * Heatmap intensity data for flood incidents
 * Used by Leaflet heatmap layer
 */
export const getHeatmapData = (): Array<[number, number, number]> => {
  // Generate heatmap points based on ward risk levels
  const heatmapPoints: Array<[number, number, number]> = [];
  
  mockWards.forEach(ward => {
    const intensity = ward.riskScore / 100;
    // Add main point
    heatmapPoints.push([ward.coordinates.lat, ward.coordinates.lng, intensity]);
    
    // Add surrounding points for spread effect
    if (ward.riskLevel === 'critical' || ward.riskLevel === 'high') {
      for (let i = 0; i < 5; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.02;
        const offsetLng = (Math.random() - 0.5) * 0.02;
        heatmapPoints.push([
          ward.coordinates.lat + offsetLat,
          ward.coordinates.lng + offsetLng,
          intensity * 0.7,
        ]);
      }
    }
  });
  
  return heatmapPoints;
};

/**
 * Get color for risk level - utility function
 */
export const getRiskColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    low: '#22c55e',      // Green
    medium: '#eab308',   // Yellow
    high: '#f97316',     // Orange
    critical: '#ef4444', // Red
  };
  return colors[level];
};

/**
 * Get risk level label - utility function
 */
export const getRiskLabel = (level: RiskLevel): string => {
  const labels: Record<RiskLevel, string> = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical Risk',
  };
  return labels[level];
};

/**
 * Simulated prediction function
 * In production, this would call POST /api/predict
 */
export const predictFloodRisk = (
  wardId: string,
  rainfall: number,
  duration: number
): {
  riskLevel: RiskLevel;
  riskScore: number;
  confidence: number;
} => {
  const ward = mockWards.find(w => w.id === wardId);
  if (!ward) {
    return { riskLevel: 'medium', riskScore: 50, confidence: 0.5 };
  }

  // Simple risk calculation based on rainfall and existing risk
  const baseScore = ward.riskScore;
  const rainfallFactor = Math.min(rainfall / 100, 1) * 30;
  const durationFactor = Math.min(duration / 24, 1) * 20;
  
  const predictedScore = Math.min(100, Math.round(baseScore + rainfallFactor + durationFactor));
  
  let riskLevel: RiskLevel;
  if (predictedScore >= 80) riskLevel = 'critical';
  else if (predictedScore >= 60) riskLevel = 'high';
  else if (predictedScore >= 40) riskLevel = 'medium';
  else riskLevel = 'low';

  return {
    riskLevel,
    riskScore: predictedScore,
    confidence: 0.78 + Math.random() * 0.15,
  };
};
