-- Create incident reports table for community reporting
CREATE TABLE public.incident_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ward_id TEXT NOT NULL,
  ward_name TEXT NOT NULL,
  zone TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  location_details TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  image_url TEXT,
  reporter_name TEXT,
  reporter_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view verified reports (public data for civic transparency)
CREATE POLICY "Anyone can view verified reports"
ON public.incident_reports
FOR SELECT
USING (status = 'verified' OR status = 'resolved');

-- Allow anyone to submit new reports (no auth required for public reporting)
CREATE POLICY "Anyone can submit reports"
ON public.incident_reports
FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_incident_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_incident_reports_updated_at
BEFORE UPDATE ON public.incident_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_incident_reports_updated_at();

-- Create storage bucket for incident images
INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-images', 'incident-images', true);

-- Allow anyone to upload images to incident-images bucket
CREATE POLICY "Anyone can upload incident images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'incident-images');

-- Allow anyone to view incident images
CREATE POLICY "Anyone can view incident images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'incident-images');

-- Enable realtime for incident reports
ALTER PUBLICATION supabase_realtime ADD TABLE public.incident_reports;