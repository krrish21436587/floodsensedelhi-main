/**
 * FloodSense Delhi - Weather Forecast Component
 * Displays 7-day weather forecast with flood risk alerts and AI-powered analysis
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, CloudRain, CloudSun, Sun, AlertTriangle, Droplets, RefreshCw, Brain, Sparkles } from 'lucide-react';
import { fetchWeatherData, type WeatherData, type DayForecast } from '@/services/weatherService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const getWeatherIcon = (condition: DayForecast['condition']) => {
  switch (condition) {
    case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />;
    case 'partly_cloudy': return <CloudSun className="w-8 h-8 text-gray-400" />;
    case 'cloudy': return <Cloud className="w-8 h-8 text-gray-500" />;
    case 'rainy': return <CloudRain className="w-8 h-8 text-blue-500" />;
    case 'heavy_rain': return <CloudRain className="w-8 h-8 text-blue-700" />;
  }
};

const getRiskColor = (risk: DayForecast['floodRisk']) => {
  switch (risk) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-orange-500';
    case 'critical': return 'bg-red-500';
  }
};

interface AIAnalysis {
  analysis: string;
  metadata: {
    totalRainfall: number;
    highRiskDays: number;
    avgHumidity: number;
    analyzedAt: string;
  };
}

const WeatherForecast = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadWeather = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData();
      setWeather(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weather');
      toast.error('Failed to load weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeFloodRisk = async (weatherData: WeatherData) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-flood-risk', {
        body: { weatherData }
      });

      if (error) throw error;
      
      setAiAnalysis(data);
    } catch (err) {
      console.error('AI analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadWeatherAndAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData();
      setWeather(data);
      setLastUpdated(new Date());
      // Auto-trigger AI analysis
      analyzeFloodRisk(data);
    } catch (err) {
      console.error('Failed to load weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weather');
      toast.error('Failed to load weather data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherAndAnalyze();
    // Refresh every 30 minutes
    const interval = setInterval(loadWeatherAndAnalyze, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">Loading weather data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
          <p className="text-sm text-muted-foreground mt-2">{error || 'Failed to load weather'}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={loadWeather}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const hasHighRiskDays = weather.forecast.some(d => d.floodRisk === 'high' || d.floodRisk === 'critical');
  const totalRainfall = weather.forecast.reduce((a, d) => a + d.rainfall, 0);

  return (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CloudRain className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">7-Day</span> Weather Forecast
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasHighRiskDays && (
              <Badge variant="destructive" className="gap-1 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span className="hidden sm:inline">Flood</span> Alert
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Delhi NCR • {weather.current.temp}°C
          </p>
          <Button variant="ghost" size="sm" onClick={loadWeatherAndAnalyze} disabled={isLoading} className="h-8 w-8 p-0">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {/* Current Weather Summary */}
        <div className="mb-4 p-2 sm:p-3 bg-primary/5 rounded-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-auto sm:h-auto flex-shrink-0">
              {getWeatherIcon(weather.forecast[0]?.condition || 'partly_cloudy')}
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{weather.current.temp}°C</p>
              <p className="text-xs sm:text-sm text-muted-foreground capitalize truncate">{weather.current.description}</p>
            </div>
          </div>
          <div className="text-right text-xs sm:text-sm">
            <p>Humidity: {weather.current.humidity}%</p>
            <p className="hidden sm:block">Wind: {weather.current.windSpeed} km/h</p>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span className="text-xs sm:text-sm font-medium">AI Flood Analysis</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => weather && analyzeFloodRisk(weather)} 
              disabled={isAnalyzing || !weather}
              className="gap-1 h-7 text-xs"
            >
              <Sparkles className={`w-3 h-3 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : aiAnalysis ? 'Refresh' : 'Get Insights'}
            </Button>
          </div>
          
          {isAnalyzing && !aiAnalysis && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
              <Sparkles className="w-5 h-5 text-purple-500 mx-auto animate-pulse" />
              <p className="text-xs text-muted-foreground mt-2">AI is analyzing weather patterns...</p>
            </div>
          )}
          
          {aiAnalysis && (
            <div className="p-3 sm:p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="prose prose-sm max-w-none text-foreground">
                {aiAnalysis.analysis.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={i} className="font-semibold text-xs sm:text-sm mt-2 mb-1">{line.replace(/\*\*/g, '')}</h4>;
                  }
                  if (line.startsWith('- ') || line.startsWith('* ')) {
                    return <p key={i} className="text-[10px] sm:text-xs text-muted-foreground ml-2 sm:ml-3 my-0.5">• {line.slice(2)}</p>;
                  }
                  if (line.match(/^\d+\./)) {
                    return <p key={i} className="text-[10px] sm:text-xs text-muted-foreground my-0.5">{line}</p>;
                  }
                  if (line.trim()) {
                    return <p key={i} className="text-[10px] sm:text-xs text-muted-foreground my-1">{line}</p>;
                  }
                  return null;
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-right">
                {new Date(aiAnalysis.metadata.analyzedAt).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Alert Banner */}
        {hasHighRiskDays && (
          <div className="mb-4 p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-red-600">Flood Warning Active</p>
              <p className="text-[10px] sm:text-xs text-red-500/80">
                Heavy rainfall expected. Stay alert.
              </p>
            </div>
          </div>
        )}

        {/* Forecast Grid - Responsive */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-2">
          {weather.forecast.slice(0, 7).map((day, i) => (
            <div 
              key={i}
              className={`p-1.5 sm:p-3 rounded-lg text-center border transition-colors ${
                i === 0 ? 'bg-primary/5 border-primary' : 'bg-muted/30 border-transparent'
              } ${i >= 4 ? 'hidden sm:block' : ''}`}
            >
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">{day.day}</p>
              <p className="text-[10px] text-muted-foreground mb-1 sm:mb-2 hidden sm:block">{day.date}</p>
              
              <div className="flex justify-center mb-1 sm:mb-2 scale-75 sm:scale-100">
                {getWeatherIcon(day.condition)}
              </div>
              
              <p className="text-xs sm:text-sm font-bold">
                {day.temp.max}°<span className="text-muted-foreground font-normal hidden sm:inline">/{day.temp.min}°</span>
              </p>
              
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                <Droplets className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500" />
                <span className="text-[10px] sm:text-xs">{day.rainfall}</span>
              </div>
              
              <div className="mt-1 sm:mt-2">
                <span 
                  className={`inline-block w-full py-0.5 rounded text-[8px] sm:text-[10px] text-white font-medium ${getRiskColor(day.floodRisk)}`}
                >
                  {day.floodRisk.slice(0, 3).toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Show more days indicator */}
        <p className="text-[10px] text-center text-muted-foreground mt-2 sm:hidden">
          Showing 4 of 7 days
        </p>

        {/* Summary */}
        <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm sm:text-lg font-bold text-blue-500">{totalRainfall}mm</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Rainfall</p>
          </div>
          <div className="p-2 sm:p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm sm:text-lg font-bold">{Math.round(weather.forecast.reduce((a, d) => a + d.humidity, 0) / 7)}%</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Humidity</p>
          </div>
          <div className="p-2 sm:p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm sm:text-lg font-bold text-orange-500">
              {weather.forecast.filter(d => d.floodRisk === 'high' || d.floodRisk === 'critical').length}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">High Risk</p>
          </div>
        </div>

        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-2 sm:mt-3">
          Updated: {lastUpdated?.toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
