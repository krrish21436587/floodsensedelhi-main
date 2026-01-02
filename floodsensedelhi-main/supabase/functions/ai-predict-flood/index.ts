/**
 * FloodSense Delhi - AI-Powered Flood Prediction Edge Function
 * Uses Lovable AI for intelligent ward-specific flood predictions
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictionRequest {
  wardName: string;
  wardId: string;
  rainfall: number;
  duration: number;
  wardData?: {
    population: number;
    area: number;
    avgRainfall: number;
    riskScore: number;
    zone: string;
  };
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

    const { wardName, wardId, rainfall, duration, wardData }: PredictionRequest = await req.json();

    if (!wardName || rainfall === undefined || duration === undefined) {
      return new Response(
        JSON.stringify({ error: 'Ward name, rainfall, and duration are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`AI prediction for ward: ${wardName}, rainfall: ${rainfall}mm, duration: ${duration}h`);

    const wardContext = wardData 
      ? `
Ward Statistics:
- Zone: ${wardData.zone}
- Population: ${wardData.population.toLocaleString()}
- Area: ${wardData.area} km²
- Historical Average Rainfall: ${wardData.avgRainfall}mm
- Current Risk Score: ${wardData.riskScore}%`
      : '';

    const systemPrompt = `You are an expert flood risk prediction AI for Delhi NCR, India. You analyze weather conditions and ward-specific data to predict flood risk.

You MUST respond in this exact JSON format:
{
  "riskLevel": "low" | "medium" | "high" | "critical",
  "riskScore": <number 0-100>,
  "confidence": <number 0.5-0.99>,
  "factors": [
    {"name": "factor name", "impact": "positive" | "negative", "description": "brief description"}
  ],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "analysis": "2-3 sentence analysis of the flood risk"
}

Consider these factors:
- Rainfall intensity (mm/hour)
- Duration of rainfall
- Delhi's drainage capacity (typically struggles above 50mm/hour)
- Historical flood patterns in Delhi
- Population density and vulnerable areas
- Monsoon season patterns (July-September highest risk)`;

    const userPrompt = `Predict flood risk for ${wardName} ward in Delhi with:
- Expected Rainfall: ${rainfall}mm
- Duration: ${duration} hours
- Rainfall Intensity: ${(rainfall / duration).toFixed(1)}mm/hour
${wardContext}

Provide a detailed flood risk prediction in the specified JSON format.`;

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
          { role: 'user', content: userPrompt }
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
      
      throw new Error('AI prediction failed');
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response from AI
    let prediction;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                        content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      prediction = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Fallback to a basic prediction based on rainfall
      const intensity = rainfall / duration;
      prediction = {
        riskLevel: intensity > 25 ? 'critical' : intensity > 15 ? 'high' : intensity > 8 ? 'medium' : 'low',
        riskScore: Math.min(95, Math.round(intensity * 3 + rainfall * 0.3)),
        confidence: 0.75,
        factors: [
          { name: 'Rainfall Intensity', impact: intensity > 15 ? 'negative' : 'positive', description: `${intensity.toFixed(1)}mm/hour` }
        ],
        recommendations: ['Monitor weather updates', 'Stay alert for official warnings'],
        analysis: `Based on ${rainfall}mm rainfall over ${duration} hours, this represents ${intensity.toFixed(1)}mm/hour intensity.`
      };
    }

    console.log(`AI prediction complete: ${prediction.riskLevel} (${prediction.riskScore}%)`);

    return new Response(
      JSON.stringify({
        ...prediction,
        wardName,
        wardId,
        input: { rainfall, duration },
        predictedAt: new Date().toISOString(),
        isAIPowered: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('AI prediction error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate prediction. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
