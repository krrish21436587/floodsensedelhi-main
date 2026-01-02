/**
 * FloodSense Delhi - ML Prediction API Edge Function
 * Proxies requests to external FastAPI/ML backend with fallback to simulated prediction
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulated ML model coefficients (fallback when external API unavailable)
const MODEL_WEIGHTS = {
  rainfall: 0.35,
  duration: 0.20,
  elevation: -0.15,
  drainageDensity: -0.10,
  historicalFrequency: 0.20,
  baseRisk: 0.1
};

// Input validation schema
const PredictionSchema = z.object({
  wardId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid ward ID format'),
  wardName: z.string().min(1).max(100),
  rainfall: z.number().min(0).max(1000),
  duration: z.number().min(0).max(168), // max 1 week
  elevation: z.number().min(0).max(1000).optional(),
  drainageDensity: z.number().min(0).max(1).optional(),
  historicalIncidents: z.number().min(0).max(1000).optional(),
});

type PredictionRequest = z.infer<typeof PredictionSchema>;

interface PredictionResponse {
  wardId: string;
  wardName: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: {
    rainfallImpact: number;
    durationImpact: number;
    elevationImpact: number;
    drainageImpact: number;
    historicalImpact: number;
  };
  recommendations: string[];
  modelVersion: string;
  isLive: boolean;
  timestamp: string;
}

/**
 * Call external FastAPI/ML backend
 */
async function callExternalMLApi(
  input: PredictionRequest, 
  apiUrl: string, 
  apiKey?: string
): Promise<PredictionResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (apiKey && apiKey.trim() !== '') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  console.log(`Calling external ML API: ${apiUrl}`);
  
  // Map to expected FastAPI format (adjust based on your actual API)
  const requestBody = {
    ward_id: input.wardId,
    ward_name: input.wardName,
    rainfall_mm: input.rainfall,
    duration_hours: input.duration,
    elevation_m: input.elevation ?? 220,
    drainage_density: input.drainageDensity ?? 0.5,
    historical_incidents: input.historicalIncidents ?? 10,
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ML API error (${response.status}): ${errorText}`);
    throw new Error('External ML API request failed');
  }

  const result = await response.json();
  console.log('ML API response received');

  // Map external API response to our format (adjust based on your actual API response structure)
  return {
    wardId: input.wardId,
    wardName: input.wardName,
    riskScore: result.risk_score ?? result.riskScore ?? 0,
    riskLevel: result.risk_level ?? result.riskLevel ?? 'low',
    confidence: result.confidence ?? 85,
    factors: {
      rainfallImpact: result.factors?.rainfall_impact ?? result.factors?.rainfallImpact ?? 0,
      durationImpact: result.factors?.duration_impact ?? result.factors?.durationImpact ?? 0,
      elevationImpact: result.factors?.elevation_impact ?? result.factors?.elevationImpact ?? 0,
      drainageImpact: result.factors?.drainage_impact ?? result.factors?.drainageImpact ?? 0,
      historicalImpact: result.factors?.historical_impact ?? result.factors?.historicalImpact ?? 0,
    },
    recommendations: result.recommendations ?? [],
    modelVersion: result.model_version ?? result.modelVersion ?? '1.0.0-live',
    isLive: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fallback: Simulate ML prediction with weighted features
 */
function simulatedPrediction(input: PredictionRequest): PredictionResponse {
  const normalizedRainfall = Math.min(input.rainfall / 200, 1);
  const normalizedDuration = Math.min(input.duration / 24, 1);
  const normalizedElevation = 1 - Math.min((input.elevation || 220) / 300, 1);
  const drainageDensity = input.drainageDensity || 0.5;
  const normalizedHistorical = Math.min((input.historicalIncidents || 10) / 25, 1);

  const rainfallImpact = normalizedRainfall * MODEL_WEIGHTS.rainfall * 100;
  const durationImpact = normalizedDuration * MODEL_WEIGHTS.duration * 100;
  const elevationImpact = normalizedElevation * MODEL_WEIGHTS.elevation * -100;
  const drainageImpact = (1 - drainageDensity) * MODEL_WEIGHTS.drainageDensity * -100;
  const historicalImpact = normalizedHistorical * MODEL_WEIGHTS.historicalFrequency * 100;

  let riskScore = MODEL_WEIGHTS.baseRisk * 100 +
    rainfallImpact + durationImpact + elevationImpact + drainageImpact + historicalImpact;

  if (input.rainfall > 100) {
    riskScore += Math.pow((input.rainfall - 100) / 100, 1.5) * 20;
  }

  riskScore = Math.max(0, Math.min(100, riskScore));

  let riskLevel: PredictionResponse['riskLevel'];
  if (riskScore >= 80) riskLevel = 'critical';
  else if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';
  else riskLevel = 'low';

  let confidence = 85;
  if (!input.elevation) confidence -= 5;
  if (!input.drainageDensity) confidence -= 5;
  if (!input.historicalIncidents) confidence -= 5;
  confidence += Math.random() * 10 - 5;
  confidence = Math.max(70, Math.min(98, confidence));

  const recommendations: string[] = [];
  if (riskLevel === 'critical' || riskLevel === 'high') {
    recommendations.push('Issue flood warning alert for the ward');
    recommendations.push('Pre-position emergency response teams');
  }
  if (input.rainfall > 100) {
    recommendations.push('Activate drainage pump stations');
    recommendations.push('Clear debris from storm drains');
  }
  if (riskLevel === 'medium') {
    recommendations.push('Monitor situation closely');
    recommendations.push('Prepare evacuation routes');
  }
  if (riskLevel === 'low') {
    recommendations.push('Routine monitoring sufficient');
  }

  return {
    wardId: input.wardId,
    wardName: input.wardName,
    riskScore: Math.round(riskScore),
    riskLevel,
    confidence: Math.round(confidence * 10) / 10,
    factors: {
      rainfallImpact: Math.round(rainfallImpact * 10) / 10,
      durationImpact: Math.round(durationImpact * 10) / 10,
      elevationImpact: Math.round(elevationImpact * 10) / 10,
      drainageImpact: Math.round(drainageImpact * 10) / 10,
      historicalImpact: Math.round(historicalImpact * 10) / 10,
    },
    recommendations,
    modelVersion: '1.0.0-simulated',
    isLive: false,
    timestamp: new Date().toISOString(),
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check request size (max 10KB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10240) {
      return new Response(
        JSON.stringify({ error: 'Request too large', code: 'PAYLOAD_TOO_LARGE' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let rawInput: unknown;
    try {
      rawInput = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload', code: 'INVALID_JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input with zod schema
    const parseResult = PredictionSchema.safeParse(rawInput);
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.issues);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input parameters', 
          code: 'VALIDATION_ERROR',
          details: parseResult.error.issues.map(i => i.message)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const input = parseResult.data;
    console.log(`Prediction request for ward: ${input.wardName}, rainfall: ${input.rainfall}mm, duration: ${input.duration}h`);

    // Check for external ML API configuration
    const mlApiUrl = Deno.env.get('ML_API_URL');
    const mlApiKey = Deno.env.get('ML_API_KEY');

    let prediction: PredictionResponse;

    if (mlApiUrl && mlApiUrl.trim() !== '') {
      try {
        // Try external ML API
        prediction = await callExternalMLApi(input, mlApiUrl, mlApiKey);
        console.log(`Live ML prediction: ${prediction.riskLevel} (${prediction.riskScore}%)`);
      } catch (apiError) {
        // Fallback to simulated prediction on error
        console.error('External ML API failed, using fallback:', apiError);
        prediction = simulatedPrediction(input);
        prediction.modelVersion = '1.0.0-fallback';
        console.log(`Fallback prediction: ${prediction.riskLevel} (${prediction.riskScore}%)`);
      }
    } else {
      // No external API configured, use simulated prediction
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
      prediction = simulatedPrediction(input);
      console.log(`Simulated prediction: ${prediction.riskLevel} (${prediction.riskScore}%)`);
    }

    return new Response(
      JSON.stringify(prediction),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Prediction error:', err);
    return new Response(
      JSON.stringify({ error: 'Prediction service temporarily unavailable', code: 'SERVICE_UNAVAILABLE' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
