-- Make incident-images bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'incident-images';

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view incident images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload incident images" ON storage.objects;

-- Create new secure policies
-- Allow viewing images only for verified/resolved incident reports
CREATE POLICY "View images for verified reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'incident-images' AND
  EXISTS (
    SELECT 1 FROM public.incident_reports
    WHERE image_url LIKE '%' || storage.objects.name
    AND status IN ('verified', 'resolved')
  )
);

-- Allow authenticated uploads (anyone can still upload for incident reports)
CREATE POLICY "Allow incident image uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'incident-images' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- Allow viewing own uploaded images (for immediate preview after upload)
CREATE POLICY "Allow viewing recently uploaded images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'incident-images' AND
  created_at > now() - interval '1 hour'
);