/**
 * FloodSense Delhi - Complete Ward Data
 * Contains all major wards/areas in Delhi with flood risk data
 */

export interface Ward {
  id: string;
  name: string;
  zone: string;
  coordinates: [number, number]; // [lat, lng]
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  population: number;
  area: number;
  avgRainfall: number;
  incidents: number;
}

// Risk color helper
export const getRiskColor = (level: string): string => {
  const colors: Record<string, string> = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  };
  return colors[level] || '#888888';
};

// All Delhi Wards/Areas
export const allWards: Ward[] = [
  // Central Delhi
  { id: 'w01', name: 'Connaught Place', zone: 'Central Delhi', coordinates: [28.6315, 77.2167], riskScore: 45, riskLevel: 'medium', population: 182000, area: 4.5, avgRainfall: 750, incidents: 8 },
  { id: 'w02', name: 'Karol Bagh', zone: 'Central Delhi', coordinates: [28.6519, 77.1909], riskScore: 72, riskLevel: 'high', population: 156000, area: 3.8, avgRainfall: 820, incidents: 15 },
  { id: 'w03', name: 'Paharganj', zone: 'Central Delhi', coordinates: [28.6448, 77.2107], riskScore: 68, riskLevel: 'high', population: 98000, area: 2.1, avgRainfall: 780, incidents: 12 },
  { id: 'w04', name: 'Daryaganj', zone: 'Central Delhi', coordinates: [28.6469, 77.2404], riskScore: 55, riskLevel: 'medium', population: 125000, area: 3.2, avgRainfall: 760, incidents: 9 },
  
  // North Delhi
  { id: 'w05', name: 'Civil Lines', zone: 'North Delhi', coordinates: [28.6814, 77.2226], riskScore: 35, riskLevel: 'low', population: 145000, area: 5.8, avgRainfall: 720, incidents: 5 },
  { id: 'w06', name: 'Model Town', zone: 'North Delhi', coordinates: [28.7173, 77.1926], riskScore: 42, riskLevel: 'medium', population: 178000, area: 6.2, avgRainfall: 740, incidents: 7 },
  { id: 'w07', name: 'Sadar Bazar', zone: 'North Delhi', coordinates: [28.6617, 77.2028], riskScore: 78, riskLevel: 'high', population: 210000, area: 3.5, avgRainfall: 850, incidents: 18 },
  { id: 'w08', name: 'Timarpur', zone: 'North Delhi', coordinates: [28.7041, 77.2167], riskScore: 48, riskLevel: 'medium', population: 132000, area: 4.8, avgRainfall: 730, incidents: 8 },
  
  // South Delhi
  { id: 'w09', name: 'Saket', zone: 'South Delhi', coordinates: [28.5244, 77.2066], riskScore: 52, riskLevel: 'medium', population: 167000, area: 6.2, avgRainfall: 710, incidents: 9 },
  { id: 'w10', name: 'Vasant Kunj', zone: 'South Delhi', coordinates: [28.5195, 77.1565], riskScore: 31, riskLevel: 'low', population: 145000, area: 9.8, avgRainfall: 680, incidents: 4 },
  { id: 'w11', name: 'Hauz Khas', zone: 'South Delhi', coordinates: [28.5494, 77.2001], riskScore: 38, riskLevel: 'low', population: 156000, area: 5.5, avgRainfall: 700, incidents: 5 },
  { id: 'w12', name: 'Greater Kailash', zone: 'South Delhi', coordinates: [28.5355, 77.2344], riskScore: 44, riskLevel: 'medium', population: 189000, area: 7.2, avgRainfall: 720, incidents: 7 },
  { id: 'w13', name: 'Malviya Nagar', zone: 'South Delhi', coordinates: [28.5318, 77.2094], riskScore: 56, riskLevel: 'medium', population: 178000, area: 5.8, avgRainfall: 740, incidents: 10 },
  { id: 'w14', name: 'Mehrauli', zone: 'South Delhi', coordinates: [28.5175, 77.1785], riskScore: 62, riskLevel: 'high', population: 234000, area: 8.5, avgRainfall: 780, incidents: 12 },
  
  // East Delhi
  { id: 'w15', name: 'Mayur Vihar', zone: 'East Delhi', coordinates: [28.5921, 77.2932], riskScore: 88, riskLevel: 'critical', population: 198000, area: 5.6, avgRainfall: 890, incidents: 22 },
  { id: 'w16', name: 'Laxmi Nagar', zone: 'East Delhi', coordinates: [28.6304, 77.2783], riskScore: 91, riskLevel: 'critical', population: 223000, area: 4.2, avgRainfall: 920, incidents: 25 },
  { id: 'w17', name: 'Preet Vihar', zone: 'East Delhi', coordinates: [28.6398, 77.2948], riskScore: 75, riskLevel: 'high', population: 187000, area: 4.8, avgRainfall: 850, incidents: 16 },
  { id: 'w18', name: 'Patparganj', zone: 'East Delhi', coordinates: [28.6165, 77.2873], riskScore: 82, riskLevel: 'critical', population: 245000, area: 6.2, avgRainfall: 880, incidents: 20 },
  { id: 'w19', name: 'Vivek Vihar', zone: 'East Delhi', coordinates: [28.6724, 77.3154], riskScore: 69, riskLevel: 'high', population: 156000, area: 4.5, avgRainfall: 810, incidents: 13 },
  
  // West Delhi
  { id: 'w20', name: 'Punjabi Bagh', zone: 'West Delhi', coordinates: [28.6714, 77.1304], riskScore: 68, riskLevel: 'high', population: 189000, area: 4.8, avgRainfall: 790, incidents: 14 },
  { id: 'w21', name: 'Rajouri Garden', zone: 'West Delhi', coordinates: [28.6469, 77.1230], riskScore: 58, riskLevel: 'medium', population: 167000, area: 5.2, avgRainfall: 760, incidents: 10 },
  { id: 'w22', name: 'Janakpuri', zone: 'West Delhi', coordinates: [28.6219, 77.0878], riskScore: 45, riskLevel: 'medium', population: 234000, area: 8.5, avgRainfall: 720, incidents: 8 },
  { id: 'w23', name: 'Tilak Nagar', zone: 'West Delhi', coordinates: [28.6408, 77.0986], riskScore: 52, riskLevel: 'medium', population: 178000, area: 4.2, avgRainfall: 740, incidents: 9 },
  { id: 'w24', name: 'Vikaspuri', zone: 'West Delhi', coordinates: [28.6375, 77.0667], riskScore: 61, riskLevel: 'high', population: 198000, area: 5.8, avgRainfall: 770, incidents: 11 },
  
  // North West Delhi
  { id: 'w25', name: 'Rohini', zone: 'North West Delhi', coordinates: [28.7495, 77.0565], riskScore: 28, riskLevel: 'low', population: 245000, area: 8.2, avgRainfall: 690, incidents: 4 },
  { id: 'w26', name: 'Pitampura', zone: 'North West Delhi', coordinates: [28.7041, 77.1329], riskScore: 48, riskLevel: 'medium', population: 167000, area: 5.1, avgRainfall: 730, incidents: 8 },
  { id: 'w27', name: 'Shalimar Bagh', zone: 'North West Delhi', coordinates: [28.7167, 77.1667], riskScore: 42, riskLevel: 'medium', population: 156000, area: 4.8, avgRainfall: 710, incidents: 7 },
  { id: 'w28', name: 'Wazirpur', zone: 'North West Delhi', coordinates: [28.7000, 77.1667], riskScore: 55, riskLevel: 'medium', population: 134000, area: 3.5, avgRainfall: 750, incidents: 9 },
  
  // South West Delhi
  { id: 'w29', name: 'Dwarka', zone: 'South West Delhi', coordinates: [28.5823, 77.0500], riskScore: 22, riskLevel: 'low', population: 312000, area: 12.5, avgRainfall: 670, incidents: 3 },
  { id: 'w30', name: 'Najafgarh', zone: 'South West Delhi', coordinates: [28.6092, 76.9798], riskScore: 85, riskLevel: 'critical', population: 198000, area: 15.2, avgRainfall: 920, incidents: 21 },
  { id: 'w31', name: 'Uttam Nagar', zone: 'South West Delhi', coordinates: [28.6167, 77.0500], riskScore: 72, riskLevel: 'high', population: 267000, area: 6.8, avgRainfall: 810, incidents: 15 },
  { id: 'w32', name: 'Palam', zone: 'South West Delhi', coordinates: [28.5833, 77.0833], riskScore: 48, riskLevel: 'medium', population: 145000, area: 7.2, avgRainfall: 720, incidents: 8 },
  
  // North East Delhi
  { id: 'w33', name: 'Shahdara', zone: 'North East Delhi', coordinates: [28.6731, 77.2893], riskScore: 75, riskLevel: 'high', population: 276000, area: 5.5, avgRainfall: 840, incidents: 16 },
  { id: 'w34', name: 'Seelampur', zone: 'North East Delhi', coordinates: [28.6833, 77.2667], riskScore: 89, riskLevel: 'critical', population: 312000, area: 4.2, avgRainfall: 910, incidents: 23 },
  { id: 'w35', name: 'Dilshad Garden', zone: 'North East Delhi', coordinates: [28.6833, 77.3167], riskScore: 66, riskLevel: 'high', population: 198000, area: 5.8, avgRainfall: 790, incidents: 12 },
  { id: 'w36', name: 'Nand Nagri', zone: 'North East Delhi', coordinates: [28.6928, 77.3156], riskScore: 78, riskLevel: 'high', population: 234000, area: 4.5, avgRainfall: 850, incidents: 17 },
  
  // South East Delhi  
  { id: 'w37', name: 'Lajpat Nagar', zone: 'South East Delhi', coordinates: [28.5689, 77.2373], riskScore: 58, riskLevel: 'medium', population: 156000, area: 3.8, avgRainfall: 750, incidents: 10 },
  { id: 'w38', name: 'Defence Colony', zone: 'South East Delhi', coordinates: [28.5744, 77.2311], riskScore: 35, riskLevel: 'low', population: 89000, area: 2.8, avgRainfall: 700, incidents: 4 },
  { id: 'w39', name: 'Kalkaji', zone: 'South East Delhi', coordinates: [28.5478, 77.2556], riskScore: 62, riskLevel: 'high', population: 178000, area: 4.5, avgRainfall: 780, incidents: 11 },
  { id: 'w40', name: 'Okhla', zone: 'South East Delhi', coordinates: [28.5311, 77.2711], riskScore: 74, riskLevel: 'high', population: 234000, area: 6.2, avgRainfall: 830, incidents: 15 },
  
  // New Delhi District
  { id: 'w41', name: 'Chanakyapuri', zone: 'New Delhi', coordinates: [28.5978, 77.1811], riskScore: 25, riskLevel: 'low', population: 45000, area: 8.5, avgRainfall: 680, incidents: 2 },
  { id: 'w42', name: 'India Gate Area', zone: 'New Delhi', coordinates: [28.6129, 77.2295], riskScore: 32, riskLevel: 'low', population: 78000, area: 6.2, avgRainfall: 700, incidents: 4 },
  { id: 'w43', name: 'Lodhi Colony', zone: 'New Delhi', coordinates: [28.5917, 77.2250], riskScore: 38, riskLevel: 'low', population: 67000, area: 4.5, avgRainfall: 710, incidents: 5 },
  
  // Additional Areas
  { id: 'w44', name: 'Chandni Chowk', zone: 'Old Delhi', coordinates: [28.6506, 77.2334], riskScore: 82, riskLevel: 'critical', population: 298000, area: 3.2, avgRainfall: 870, incidents: 19 },
  { id: 'w45', name: 'Jama Masjid', zone: 'Old Delhi', coordinates: [28.6507, 77.2334], riskScore: 79, riskLevel: 'high', population: 267000, area: 2.8, avgRainfall: 860, incidents: 17 },
  { id: 'w46', name: 'Kashmere Gate', zone: 'Old Delhi', coordinates: [28.6667, 77.2333], riskScore: 71, riskLevel: 'high', population: 178000, area: 3.5, avgRainfall: 820, incidents: 14 },
  { id: 'w47', name: 'Sarojini Nagar', zone: 'South West Delhi', coordinates: [28.5753, 77.1939], riskScore: 54, riskLevel: 'medium', population: 156000, area: 4.2, avgRainfall: 740, incidents: 9 },
  { id: 'w48', name: 'Moti Bagh', zone: 'South West Delhi', coordinates: [28.5833, 77.1667], riskScore: 41, riskLevel: 'medium', population: 123000, area: 3.8, avgRainfall: 720, incidents: 6 },
  { id: 'w49', name: 'Narela', zone: 'North Delhi', coordinates: [28.8522, 77.0928], riskScore: 36, riskLevel: 'low', population: 189000, area: 12.5, avgRainfall: 690, incidents: 5 },
  { id: 'w50', name: 'Bawana', zone: 'North Delhi', coordinates: [28.7989, 77.0333], riskScore: 44, riskLevel: 'medium', population: 156000, area: 10.2, avgRainfall: 710, incidents: 7 },
];

// Monthly rainfall data for charts
export const monthlyRainfallData = [
  { month: 'Jan', rainfall: 15, incidents: 0 },
  { month: 'Feb', rainfall: 18, incidents: 0 },
  { month: 'Mar', rainfall: 22, incidents: 1 },
  { month: 'Apr', rainfall: 28, incidents: 1 },
  { month: 'May', rainfall: 45, incidents: 2 },
  { month: 'Jun', rainfall: 180, incidents: 8 },
  { month: 'Jul', rainfall: 280, incidents: 15 },
  { month: 'Aug', rainfall: 250, incidents: 12 },
  { month: 'Sep', rainfall: 150, incidents: 7 },
  { month: 'Oct', rainfall: 35, incidents: 2 },
  { month: 'Nov', rainfall: 12, incidents: 0 },
  { month: 'Dec', rainfall: 10, incidents: 0 },
];

// Zone-wise risk distribution
export const zoneRiskData = [
  { zone: 'Central Delhi', avgRisk: 60, wards: 4 },
  { zone: 'North Delhi', avgRisk: 51, wards: 4 },
  { zone: 'South Delhi', avgRisk: 47, wards: 6 },
  { zone: 'East Delhi', avgRisk: 81, wards: 5 },
  { zone: 'West Delhi', avgRisk: 57, wards: 5 },
  { zone: 'North West Delhi', avgRisk: 43, wards: 4 },
  { zone: 'South West Delhi', avgRisk: 57, wards: 4 },
  { zone: 'North East Delhi', avgRisk: 77, wards: 4 },
  { zone: 'South East Delhi', avgRisk: 57, wards: 4 },
  { zone: 'New Delhi', avgRisk: 32, wards: 3 },
  { zone: 'Old Delhi', avgRisk: 77, wards: 3 },
];
