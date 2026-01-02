/**
 * FloodSense Delhi - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the application. Keeping types centralized helps maintain consistency
 * and makes the codebase easier to understand.
 */

/**
 * Risk level enum - represents flood risk severity
 * Used for color-coding and priority sorting
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Geographic coordinates for map positioning
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Ward data structure - represents a Delhi administrative ward
 * Each ward has geographic boundaries and associated flood risk data
 */
export interface Ward {
  id: string;                    // Unique identifier (e.g., "ward_01")
  name: string;                  // Display name (e.g., "Connaught Place")
  zone: string;                  // Administrative zone (e.g., "Central Delhi")
  population: number;            // Estimated population
  area: number;                  // Area in square kilometers
  coordinates: Coordinates;      // Center point for map positioning
  riskLevel: RiskLevel;          // Current flood risk assessment
  riskScore: number;             // Numerical risk score (0-100)
}

/**
 * Flood incident record - historical flood event data
 */
export interface FloodIncident {
  id: string;
  wardId: string;
  date: string;                  // ISO date string
  severity: RiskLevel;           // How severe was the flooding
  waterLevel: number;            // Peak water level in cm
  duration: number;              // Duration in hours
  affectedArea: number;          // Affected area in hectares
  casualties: number;            // Number of casualties (if any)
  damageEstimate: number;        // Estimated damage in INR lakhs
}

/**
 * Ward statistics - aggregated data for a ward
 */
export interface WardStatistics {
  wardId: string;
  totalIncidents: number;        // Total flood incidents recorded
  avgRainfall: number;           // Average annual rainfall in mm
  drainageDensity: number;       // Drainage infrastructure score (0-1)
  elevation: number;             // Average elevation in meters
  imperviousSurface: number;     // Percentage of impervious surface
  lastFloodDate: string | null;  // Date of last flood incident
  monthlyRainfall: MonthlyData[]; // Monthly rainfall data for charts
}

/**
 * Monthly data point for time-series charts
 */
export interface MonthlyData {
  month: string;                 // Month name (e.g., "Jan", "Feb")
  rainfall: number;              // Rainfall in mm
  incidents: number;             // Number of flood incidents
}

/**
 * Prediction request - input for ML model
 */
export interface PredictionRequest {
  wardId: string;
  rainfall: number;              // Expected rainfall in mm
  duration: number;              // Expected duration in hours
  season: 'monsoon' | 'post-monsoon' | 'winter' | 'summer';
}

/**
 * Prediction response - output from ML model
 */
export interface PredictionResponse {
  wardId: string;
  wardName: string;
  predictedRisk: RiskLevel;
  riskScore: number;             // 0-100 score
  confidence: number;            // Model confidence (0-1)
  factors: RiskFactor[];         // Contributing factors
  recommendations: string[];     // Suggested actions
}

/**
 * Risk factor - explains what contributes to flood risk
 */
export interface RiskFactor {
  name: string;                  // Factor name (e.g., "Drainage Capacity")
  impact: 'positive' | 'negative'; // Does it increase or decrease risk
  weight: number;                // Contribution to overall score (0-1)
  description: string;           // Human-readable explanation
}

/**
 * GeoJSON feature for map rendering
 * Simplified structure for ward boundaries
 */
export interface WardGeoFeature {
  type: 'Feature';
  properties: {
    wardId: string;
    name: string;
    riskLevel: RiskLevel;
    riskScore: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

/**
 * Dashboard summary statistics
 */
export interface DashboardSummary {
  totalWards: number;
  wardsAtRisk: number;           // Wards with high/critical risk
  totalIncidents: number;        // Total incidents this year
  avgRiskScore: number;          // Average risk score across all wards
  lastUpdated: string;           // ISO timestamp of last data update
}

/**
 * Chart data format for Recharts
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
