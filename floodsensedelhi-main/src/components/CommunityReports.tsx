/**
 * FloodSense Delhi - Community Reports Display
 * Shows verified waterlogging incidents reported by citizens
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, MapPin, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getRiskColor } from '@/data/wardData';

interface IncidentReport {
  id: string;
  ward_name: string;
  zone: string;
  description: string;
  severity: string;
  location_details: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
}

const CommunityReports = () => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReports();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('incident-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incident_reports'
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReports = async () => {
    try {
      // Use public view that excludes sensitive PII (reporter_name, reporter_phone)
      const { data, error } = await supabase
        .from('incident_reports_public')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setReports(data || []);
      
      // Generate signed URLs for images (bucket is private)
      if (data) {
        const urlPromises = data
          .filter(report => report.image_url)
          .map(async (report) => {
            try {
              // Handle both full URLs and file paths
              const imagePath = report.image_url!.includes('incident-images/')
                ? report.image_url!.split('incident-images/').pop()
                : report.image_url;
              
              if (imagePath) {
                const { data: signedData } = await supabase.storage
                  .from('incident-images')
                  .createSignedUrl(imagePath, 3600); // 1 hour expiry
                
                if (signedData?.signedUrl) {
                  return { id: report.id, url: signedData.signedUrl };
                }
              }
            } catch (err) {
              console.error('Error generating signed URL:', err);
            }
            return null;
          });
        
        const results = await Promise.all(urlPromises);
        const urlMap: Record<string, string> = {};
        results.forEach(result => {
          if (result) {
            urlMap[result.id] = result.url;
          }
        });
        setSignedUrls(urlMap);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getSeverityColor = (severity: string) => {
    return getRiskColor(severity as any);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">Loading reports...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Reports
          </CardTitle>
          <Badge variant="secondary">{reports.length} reports</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Recent waterlogging incidents reported by citizens
        </p>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No reports yet.</p>
            <p className="text-sm">Be the first to report an incident!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="px-2 py-0.5 rounded text-xs text-white font-medium"
                          style={{ backgroundColor: getSeverityColor(report.severity) }}
                        >
                          {report.severity.toUpperCase()}
                        </span>
                        {report.status === 'verified' && (
                          <Badge variant="outline" className="gap-1 text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                        {report.status === 'resolved' && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      
                      <p className="font-medium text-sm">{report.ward_name}</p>
                      <p className="text-xs text-muted-foreground">{report.zone}</p>
                      
                      {report.location_details && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {report.location_details}
                        </p>
                      )}
                      
                      <p className="text-sm mt-2 line-clamp-2">{report.description}</p>
                    </div>
                    
                    {report.image_url && signedUrls[report.id] && (
                      <img
                        src={signedUrls[report.id]}
                        alt="Incident"
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(report.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityReports;
