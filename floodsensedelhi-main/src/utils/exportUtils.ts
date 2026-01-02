/**
 * FloodSense Delhi - Export Functionality
 * Provides CSV and PDF export for ward data and reports
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { allWards, type Ward } from '@/data/wardData';

/**
 * Export ward data as CSV file
 */
export const exportToCSV = (wards: Ward[] = allWards, filename = 'floodsense-delhi-wards') => {
  const headers = [
    'Ward ID',
    'Name',
    'Zone',
    'Risk Level',
    'Risk Score (%)',
    'Population',
    'Area (km²)',
    'Avg Rainfall (mm)',
    'Flood Incidents',
    'Latitude',
    'Longitude'
  ];

  const rows = wards.map(ward => [
    ward.id,
    ward.name,
    ward.zone,
    ward.riskLevel,
    ward.riskScore,
    ward.population,
    ward.area,
    ward.avgRainfall,
    ward.incidents,
    ward.coordinates[0],
    ward.coordinates[1]
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

/**
 * Export ward data as PDF report
 */
export const exportToPDF = (wards: Ward[] = allWards, filename = 'floodsense-delhi-report') => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 95);
  doc.text('FloodSense Delhi', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Smart Water-Logging Hotspot Mapping & Prediction System', 14, 28);
  
  // Report info
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);
  doc.text(`Total Wards: ${wards.length}`, 14, 42);
  
  // Summary stats
  const highRisk = wards.filter(w => w.riskLevel === 'high' || w.riskLevel === 'critical').length;
  const avgRisk = Math.round(wards.reduce((a, w) => a + w.riskScore, 0) / wards.length);
  const totalIncidents = wards.reduce((a, w) => a + w.incidents, 0);
  
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);
  doc.text('Summary Statistics', 14, 54);
  
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(`• High/Critical Risk Wards: ${highRisk}`, 14, 62);
  doc.text(`• Average Risk Score: ${avgRisk}%`, 14, 68);
  doc.text(`• Total Flood Incidents: ${totalIncidents}`, 14, 74);
  
  // Ward table
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);
  doc.text('Ward Data', 14, 86);
  
  const tableData = wards.map(ward => [
    ward.name,
    ward.zone,
    ward.riskLevel.toUpperCase(),
    `${ward.riskScore}%`,
    `${(ward.population / 1000).toFixed(0)}K`,
    `${ward.avgRainfall}mm`,
    ward.incidents.toString()
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['Ward', 'Zone', 'Risk', 'Score', 'Population', 'Rainfall', 'Incidents']],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: [30, 58, 95],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: { 
      fontSize: 7 
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 35 },
      2: { cellWidth: 18 },
      3: { cellWidth: 15 },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { cellWidth: 18 }
    },
    didParseCell: (data) => {
      // Color code risk levels
      if (data.column.index === 2 && data.section === 'body') {
        const risk = data.cell.raw?.toString().toLowerCase();
        if (risk === 'critical') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else if (risk === 'high') {
          data.cell.styles.textColor = [249, 115, 22];
          data.cell.styles.fontStyle = 'bold';
        } else if (risk === 'medium') {
          data.cell.styles.textColor = [234, 179, 8];
        }
      }
    }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `FloodSense Delhi Report • Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`${filename}.pdf`);
};

/**
 * Export filtered/selected ward data
 */
export const exportSelectedWard = (ward: Ward) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 95);
  doc.text(`Ward Report: ${ward.name}`, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Zone: ${ward.zone}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
  
  // Risk info
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text('Risk Assessment', 14, 48);
  
  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Risk Level: ${ward.riskLevel.toUpperCase()}`, 14, 58);
  doc.text(`Risk Score: ${ward.riskScore}%`, 14, 66);
  doc.text(`Historical Flood Incidents: ${ward.incidents}`, 14, 74);
  
  // Demographics
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text('Demographics & Geography', 14, 90);
  
  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Population: ${ward.population.toLocaleString()}`, 14, 100);
  doc.text(`Area: ${ward.area} km²`, 14, 108);
  doc.text(`Average Annual Rainfall: ${ward.avgRainfall}mm`, 14, 116);
  doc.text(`Coordinates: ${ward.coordinates[0].toFixed(4)}°N, ${ward.coordinates[1].toFixed(4)}°E`, 14, 124);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    'FloodSense Delhi - Smart Water-Logging Hotspot Mapping',
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );

  doc.save(`ward-report-${ward.id}.pdf`);
};
