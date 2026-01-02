/**
 * FloodSense Delhi - Community Incident Reporting Form
 * Allows citizens to report waterlogging incidents
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Camera, MapPin, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { allWards } from '@/data/wardData';
import { toast } from '@/hooks/use-toast';

const IncidentReportForm = () => {
  const [selectedWardId, setSelectedWardId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedWard = allWards.find(w => w.id === selectedWardId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWardId || !description || !severity) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided (max 5MB, images only)
      if (imageFile) {
        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          toast({
            title: 'File Too Large',
            description: 'Please upload an image smaller than 5MB.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(imageFile.type)) {
          toast({
            title: 'Invalid File Type',
            description: 'Please upload a valid image (JPEG, PNG, GIF, or WebP).',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `incidents/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('incident-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
        } else {
          // Store the file path (not public URL since bucket is now private)
          imageUrl = fileName;
        }
      }

      // Insert report into database
      const { error } = await supabase
        .from('incident_reports')
        .insert({
          ward_id: selectedWardId,
          ward_name: selectedWard?.name || '',
          zone: selectedWard?.zone || '',
          description,
          severity,
          location_details: locationDetails || null,
          latitude: selectedWard?.coordinates[0] || null,
          longitude: selectedWard?.coordinates[1] || null,
          image_url: imageUrl,
          reporter_name: reporterName || null,
          reporter_phone: reporterPhone || null,
        });

      if (error) throw error;

      toast({
        title: 'Report Submitted',
        description: 'Thank you for reporting. Your report will be reviewed shortly.',
      });

      // Reset form
      setSelectedWardId('');
      setDescription('');
      setSeverity('');
      setLocationDetails('');
      setReporterName('');
      setReporterPhone('');
      setImageFile(null);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Submission Failed',
        description: 'Could not submit report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Report Waterlogging Incident
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ward Selection */}
          <div className="space-y-2">
            <Label>Ward / Area *</Label>
            <Select value={selectedWardId} onValueChange={setSelectedWardId}>
              <SelectTrigger>
                <SelectValue placeholder="Select affected ward..." />
              </SelectTrigger>
              <SelectContent>
                {allWards.map(ward => (
                  <SelectItem key={ward.id} value={ward.id}>
                    {ward.name} ({ward.zone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label>Severity Level *</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="How severe is the waterlogging?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minor puddles</SelectItem>
                <SelectItem value="medium">Medium - Ankle-deep water</SelectItem>
                <SelectItem value="high">High - Knee-deep water</SelectItem>
                <SelectItem value="critical">Critical - Waist-deep or higher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe the waterlogging situation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Location Details */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Specific Location
            </Label>
            <Input
              placeholder="e.g., Near Main Market, Sector 5..."
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Upload Photo (Optional)
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Your Name (Optional)</Label>
              <Input
                placeholder="Name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone (Optional)</Label>
              <Input
                placeholder="Phone number"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your report helps authorities respond faster to flood emergencies.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncidentReportForm;
