/**
 * FloodSense Delhi - AI-Powered Flood Prediction Form
 * Uses AI to predict flood risk based on ward and weather inputs
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import WardSelector from './WardSelector';
import RiskBadge from './RiskBadge';
import { allWards } from '@/data/wardData';
import { supabase } from '@/integrations/supabase/client';
import { CloudRain, Timer, Calculator, AlertTriangle, Brain, Sparkles, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import type { RiskLevel } from '@/types/floodData';

interface PredictionResult {
  riskLevel: RiskLevel;
  riskScore: number;
  confidence: number;
  wardName: string;
  factors?: Array<{ name: string; impact: string; description: string }>;
  recommendations?: string[];
  analysis?: string;
  isAIPowered?: boolean;
}

const PredictionForm = () => {
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [rainfall, setRainfall] = useState<string>('100');
  const [duration, setDuration] = useState<string>('6');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = async () => {
    if (!selectedWardId) return;

    setIsLoading(true);
    setResult(null);

    const ward = allWards.find(w => w.id === selectedWardId);
    if (!ward) {
      toast.error('Ward not found');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-predict-flood', {
        body: {
          wardName: ward.name,
          wardId: ward.id,
          rainfall: parseFloat(rainfall) || 0,
          duration: parseFloat(duration) || 0,
          wardData: {
            population: ward.population,
            area: ward.area,
            avgRainfall: ward.avgRainfall,
            riskScore: ward.riskScore,
            zone: ward.zone
          }
        }
      });

      if (error) throw error;

      setResult({
        riskLevel: data.riskLevel,
        riskScore: data.riskScore,
        confidence: data.confidence,
        wardName: ward.name,
        factors: data.factors,
        recommendations: data.recommendations,
        analysis: data.analysis,
        isAIPowered: data.isAIPowered
      });
    } catch (err) {
      console.error('Prediction failed:', err);
      toast.error('Failed to get AI prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedWardId(null);
    setRainfall('100');
    setDuration('6');
    setResult(null);
  };

  const getRiskColor = (level: RiskLevel) => {
    const colors = {
      low: '#22c55e',
      medium: '#eab308',
      high: '#f97316',
      critical: '#ef4444',
    };
    return colors[level];
  };

  return (
    <div className="bg-card rounded-xl p-4 sm:p-5 border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="p-2 sm:p-2.5 rounded-lg bg-purple-500/10">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            AI Flood Prediction
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            Intelligent risk analysis powered by AI
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-3 sm:space-y-4">
        <WardSelector
          selectedWardId={selectedWardId}
          onWardChange={setSelectedWardId}
          label="Select Ward"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rainfall" className="flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm">
              <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
              <span className="hidden sm:inline">Rainfall</span> (mm)
            </Label>
            <Input
              id="rainfall"
              type="number"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              placeholder="mm"
              min="0"
              max="500"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="duration" className="flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm">
              <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
              <span className="hidden sm:inline">Duration</span> (hrs)
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="hours"
              min="1"
              max="72"
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 pt-1">
          <Button
            onClick={handlePredict}
            disabled={!selectedWardId || isLoading}
            className="flex-1 gap-1.5 text-sm"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Calculator className="w-3.5 h-3.5" />
                Predict Risk
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            size="sm"
            className="px-3"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Prediction Result */}
      {result && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-muted/50 border border-border animate-fade-in">
          <div className="flex items-start gap-2 sm:gap-3 mb-3">
            <AlertTriangle 
              className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" 
              style={{ color: getRiskColor(result.riskLevel) }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm sm:text-base text-foreground">
                  {result.wardName}
                </h4>
                {result.isAIPowered && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-600 rounded-full">
                    AI Powered
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {rainfall}mm over {duration}hrs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Risk Level
              </p>
              <RiskBadge level={result.riskLevel} size="md" animated />
            </div>

            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Score
              </p>
              <span className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                {result.riskScore}%
              </span>
            </div>

            <div className="col-span-2">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Confidence
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-purple-500"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {result.analysis && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-foreground leading-relaxed">
                {result.analysis}
              </p>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                Recommendations
              </p>
              <ul className="space-y-1">
                {result.recommendations.slice(0, 3).map((rec, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
