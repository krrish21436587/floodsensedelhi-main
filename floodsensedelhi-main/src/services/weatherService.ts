/**
 * FloodSense Delhi - Weather Service
 * Fetches real-time weather data via backend edge function
 */

import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
  };
  forecast: DayForecast[];
  isLive: boolean;
}

export interface DayForecast {
  day: string;
  date: string;
  temp: { min: number; max: number };
  rainfall: number;
  humidity: number;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'heavy_rain';
  floodRisk: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Fetch weather data from backend edge function
 */
export const fetchWeatherData = async (): Promise<WeatherData> => {
  const { data, error } = await supabase.functions.invoke('weather');

  if (error) {
    console.error('Weather fetch error:', error);
    throw new Error('Failed to fetch weather data');
  }

  if (data.error) {
    console.error('Weather API error:', data.error);
    throw new Error(data.error);
  }

  return data as WeatherData;
};
