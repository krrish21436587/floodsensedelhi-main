/**
 * FloodSense Delhi - AI Flood Risk Analysis Edge Function
 * Uses Lovable AI to provide intelligent flood risk analysis and recommendations
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherData {
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
    condition: string;
    floodRisk: string;
  }>;
}

interface AnalysisRequest {
  weatherData: WeatherData;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { weatherData }: AnalysisRequest = await req.json();

    if (!weatherData || !weatherData.forecast) {
      return new Response(
        JSON.stringify({ error: 'Weather data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing flood risk with AI for weather data...');

    // Prepare the weather summary for AI analysis
    const totalRainfall = weatherData.forecast.reduce((a, d) => a + d.rainfall, 0);
    const highRiskDays = weatherData.forecast.filter(d => d.floodRisk === 'high' || d.floodRisk === 'critical');
    const avgHumidity = Math.round(weatherData.forecast.reduce((a, d) => a + d.humidity, 0) / weatherData.forecast.length);

    const weatherSummary = `
Current Weather in Delhi NCR:
- Temperature: ${weatherData.current.temp}°C
- Humidity: ${weatherData.current.humidity}%
- Wind Speed: ${weatherData.current.windSpeed} km/h
- Conditions: ${weatherData.current.description}

7-Day Forecast Summary:
- Total Expected Rainfall: ${totalRainfall}mm
- Average Humidity: ${avgHumidity}%
- High/Critical Risk Days: ${highRiskDays.length}
- Days with Heavy Rain: ${weatherData.forecast.filter(d => d.condition === 'heavy_rain').length}

Daily Breakdown:
${weatherData.forecast.map(d => `- ${d.day} (${d.date}): ${d.temp.max}°C/${d.temp.min}°C, ${d.rainfall}mm rain, ${d.humidity}% humidity, Risk: ${d.floodRisk}`).join('\n')}
`;

    const systemPrompt = `You are an expert flood risk analyst for Delhi NCR, India. Analyze the weather data and provide:

1. **Overall Risk Assessment**: A brief summary of the flood risk for the coming week (1-2 sentences)
2. **Key Concerns**: List 2-3 specific concerns based on the data
3. **Recommendations**: Provide 3-4 actionable safety recommendations for residents
4. **Vulnerable Areas**: Mention Delhi areas most at risk during heavy rainfall (e.g., low-lying areas, poor drainage zones)

Keep your response concise, actionable, and focused on public safety. Use simple language that general public can understand.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please analyze this weather data for Delhi and provide flood risk assessment:\n\n${weatherSummary}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error (${response.status}): ${errorText}`);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI analysis failed');
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis received from AI');
    }

    console.log('AI flood risk analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        analysis,
        metadata: {
          totalRainfall,
          highRiskDays: highRiskDays.length,
          avgHumidity,
          analyzedAt: new Date().toISOString()
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Flood risk analysis error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze flood risk. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
