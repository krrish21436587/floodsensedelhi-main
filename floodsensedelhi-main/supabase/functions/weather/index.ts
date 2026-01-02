/**
 * FloodSense Delhi - Weather API Edge Function
 * Fetches live weather data from OpenWeatherMap API
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Delhi coordinates
const DELHI_LAT = 28.6139;
const DELHI_LON = 77.2090;

interface WeatherResponse {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
  };
  forecast: Array<{
    day: string;
    date: string;
    temp: { min: number; max: number };
    humidity: number;
    rainfall: number;
    condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'heavy_rain';
    floodRisk: 'low' | 'medium' | 'high' | 'critical';
  }>;
  isLive: boolean;
}

function mapCondition(weatherId: number): WeatherResponse['forecast'][0]['condition'] {
  if (weatherId >= 200 && weatherId < 300) return 'heavy_rain'; // Thunderstorm
  if (weatherId >= 300 && weatherId < 400) return 'rainy'; // Drizzle
  if (weatherId >= 500 && weatherId < 505) return 'rainy'; // Light to moderate rain
  if (weatherId >= 505 && weatherId < 600) return 'heavy_rain'; // Heavy rain
  if (weatherId >= 600 && weatherId < 700) return 'cloudy'; // Snow (treat as cloudy)
  if (weatherId >= 700 && weatherId < 800) return 'cloudy'; // Atmosphere
  if (weatherId === 800) return 'sunny'; // Clear
  if (weatherId === 801) return 'partly_cloudy'; // Few clouds
  if (weatherId >= 802) return 'cloudy'; // Clouds
  return 'partly_cloudy';
}

function calculateFloodRisk(rainfall: number): WeatherResponse['forecast'][0]['floodRisk'] {
  if (rainfall >= 100) return 'critical';
  if (rainfall >= 50) return 'high';
  if (rainfall >= 20) return 'medium';
  return 'low';
}

function getDayName(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

function formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Allow both GET and POST requests (Supabase SDK uses POST by default)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const apiKeyRaw = Deno.env.get('OPENWEATHERMAP_API_KEY');
    const apiKey = apiKeyRaw?.trim();

    if (!apiKey) {
      console.error('OPENWEATHERMAP_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Weather service not configured', code: 'SERVICE_NOT_CONFIGURED' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching weather data from OpenWeatherMap... (key length: ${apiKey.length})`);

    // Fetch current weather and 7-day forecast
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${DELHI_LAT}&lon=${DELHI_LON}&units=metric&appid=${apiKey}`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${DELHI_LAT}&lon=${DELHI_LON}&units=metric&appid=${apiKey}`
      ),
    ]);

    if (!currentRes.ok) {
      const errorText = await currentRes.text();
      console.error(`Current weather API error (${currentRes.status}): ${errorText}`);
      throw new Error('Weather API request failed');
    }

    if (!forecastRes.ok) {
      const errorText = await forecastRes.text();
      console.error(`Forecast API error (${forecastRes.status}): ${errorText}`);
      throw new Error('Weather forecast API request failed');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    console.log('Weather data received successfully');

    // Process current weather
    const current = {
      temp: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
      description: currentData.weather[0].description,
    };

    // Process 5-day/3-hour forecast into daily forecast
    const dailyMap = new Map<string, {
      temps: number[];
      humidities: number[];
      rainfall: number;
      weatherIds: number[];
      date: Date;
    }>();

    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          temps: [],
          humidities: [],
          rainfall: 0,
          weatherIds: [],
          date,
        });
      }

      const day = dailyMap.get(dateKey)!;
      day.temps.push(item.main.temp);
      day.humidities.push(item.main.humidity);
      day.rainfall += (item.rain?.['3h'] || 0);
      day.weatherIds.push(item.weather[0].id);
    }

    // Convert to forecast array (limit to 7 days)
    const forecast: WeatherResponse['forecast'] = [];
    const sortedDays = Array.from(dailyMap.values()).slice(0, 7);

    for (const day of sortedDays) {
      const minTemp = Math.round(Math.min(...day.temps));
      const maxTemp = Math.round(Math.max(...day.temps));
      const avgHumidity = Math.round(day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length);
      const rainfall = Math.round(day.rainfall);
      
      // Get most common weather condition
      const conditionCounts = new Map<number, number>();
      for (const id of day.weatherIds) {
        conditionCounts.set(id, (conditionCounts.get(id) || 0) + 1);
      }
      const dominantWeatherId = Array.from(conditionCounts.entries())
        .sort((a, b) => b[1] - a[1])[0][0];

      forecast.push({
        day: getDayName(day.date),
        date: formatDate(day.date),
        temp: { min: minTemp, max: maxTemp },
        humidity: avgHumidity,
        rainfall,
        condition: mapCondition(dominantWeatherId),
        floodRisk: calculateFloodRisk(rainfall),
      });
    }

    const response: WeatherResponse = {
      current,
      forecast,
      isLive: true,
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Weather fetch error:', err);
    return new Response(
      JSON.stringify({ error: 'Weather data temporarily unavailable', code: 'SERVICE_UNAVAILABLE' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
