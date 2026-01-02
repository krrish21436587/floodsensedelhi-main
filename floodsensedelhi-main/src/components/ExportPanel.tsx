/**
 * FloodSense Delhi - Export Panel Component
 * UI for exporting data as CSV or PDF
 */

import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';
import { allWards } from '@/data/wardData';
import { toast } from '@/hooks/use-toast';

const ExportPanel = () => {
  const handleExportCSV = () => {
    try {
      exportToCSV(allWards);
      toast({
        title: 'Export Successful',
        description: 'Ward data exported as CSV file.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Could not export CSV file.',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(allWards);
      toast({
        title: 'Export Successful',
        description: 'Report exported as PDF file.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Could not export PDF file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Download className="w-5 h-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Download ward data and flood risk reports for offline analysis.
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={handleExportCSV}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </Button>
          <Button 
            variant="default" 
            className="flex-1 gap-2"
            onClick={handleExportPDF}
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Includes all {allWards.length} wards with risk data
        </p>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
