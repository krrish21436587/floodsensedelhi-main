/**
 * FloodSense Delhi - Flood Risk Prediction Form
 * Calls the ML prediction API edge function
 */

import { useState } from 'react';
import { Calculator, Droplets, Clock, AlertTriangle, Loader2, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { allWards, getRiskColor } from '@/data/wardData';
import { toast } from '@/hooks/use-toast';

interface PredictionResult {
  wardId: string;
  wardName: string;
  riskScore: number;
  riskLevel: string;
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
  timestamp: string;
}

const PredictionForm = () => {
  const [selectedWardId, setSelectedWardId] = useState<string>('');
  const [rainfall, setRainfall] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handlePredict = async () => {
    if (!selectedWardId || !rainfall || !duration) return;
    
    const ward = allWards.find(w => w.id === selectedWardId);
    if (!ward) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('predict-flood-risk', {
        body: {
          wardId: selectedWardId,
          wardName: ward.name,
          rainfall: parseFloat(rainfall),
          duration: parseFloat(duration),
          elevation: 220 - (ward.riskScore * 0.5), // Simulated elevation
          drainageDensity: 1 - (ward.riskScore / 100), // Simulated drainage
          historicalIncidents: ward.incidents,
        }
      });

      if (error) throw error;

      setResult(data as PredictionResult);
      
      if (data.riskLevel === 'critical' || data.riskLevel === 'high') {
        toast({
          title: `⚠️ ${data.riskLevel.toUpperCase()} Risk Detected`,
          description: `${ward.name} has a ${data.riskScore}% flood risk with the given conditions.`,
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Prediction error:', err);
      toast({
        title: 'Prediction Failed',
        description: 'Could not get prediction from ML model. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedWardId('');
    setRainfall('');
    setDuration('');
    setResult(null);
    setShowDetails(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          ML Flood Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Ward Selection */}
        <div className="space-y-1">
          <Label className="text-xs">Ward</Label>
          <Select value={selectedWardId} onValueChange={setSelectedWardId}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select ward..." />
            </SelectTrigger>
            <SelectContent>
              {allWards.map(ward => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Inputs Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              Rainfall (mm)
            </Label>
            <Input
              type="number"
              placeholder="150"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              className="h-9"
              min="0"
              max="500"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Duration (hrs)
            </Label>
            <Input
              type="number"
              placeholder="6"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-9"
              min="1"
              max="72"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handlePredict} 
            disabled={!selectedWardId || !rainfall || !duration || isLoading}
            className="flex-1 gap-2"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4" />
            )}
            {isLoading ? 'Predicting...' : 'Predict'}
          </Button>
          <Button variant="outline" onClick={handleReset} size="sm">
            Reset
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: getRiskColor(result.riskLevel) }} />
                <span className="font-semibold text-sm">{result.wardName}</span>
              </div>
              <span 
                className="px-2 py-0.5 rounded-full text-xs text-white font-bold"
                style={{ backgroundColor: getRiskColor(result.riskLevel) }}
              >
                {result.riskLevel.toUpperCase()}
              </span>
            </div>
            
            {/* Risk bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${result.riskScore}%`,
                  backgroundColor: getRiskColor(result.riskLevel)
                }}
              />
            </div>

            <div className="flex justify-between text-xs">
              <span>Risk: <strong>{result.riskScore}%</strong></span>
              <span>Confidence: <strong>{result.confidence}%</strong></span>
            </div>

            {/* Expandable Details */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-6 text-xs"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>

            {showDetails && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-xs font-medium">Factor Impacts:</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span>Rainfall: {result.factors.rainfallImpact > 0 ? '+' : ''}{result.factors.rainfallImpact}%</span>
                  <span>Duration: {result.factors.durationImpact > 0 ? '+' : ''}{result.factors.durationImpact}%</span>
                  <span>Elevation: {result.factors.elevationImpact > 0 ? '+' : ''}{result.factors.elevationImpact}%</span>
                  <span>Drainage: {result.factors.drainageImpact > 0 ? '+' : ''}{result.factors.drainageImpact}%</span>
                </div>
                
                {result.recommendations.length > 0 && (
                  <>
                    <p className="text-xs font-medium mt-2">Recommendations:</p>
                    <ul className="text-xs space-y-1">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="text-muted-foreground">• {rec}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                <p className="text-[10px] text-muted-foreground mt-2">
                  Model: {result.modelVersion} • {new Date(result.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground text-center">
          Powered by ML Edge Function API
        </p>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
