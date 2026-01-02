-- FIX 1: Recreate view with SECURITY INVOKER to address Security Definer View warning
DROP VIEW IF EXISTS public.incident_reports_public;

CREATE VIEW public.incident_reports_public
WITH (security_invoker = true)
AS
SELECT 
  id,
  ward_id,
  ward_name,
  zone,
  description,
  severity,
  location_details,
  latitude,
  longitude,
  image_url,
  status,
  created_at,
  verified_at,
  resolved_at,
  updated_at
FROM public.incident_reports
WHERE status IN ('verified', 'resolved');

-- Grant access to the view
GRANT SELECT ON public.incident_reports_public TO anon;
GRANT SELECT ON public.incident_reports_public TO authenticated;

-- Add RLS policy to support the SECURITY INVOKER view (excludes PII columns in app code)
CREATE POLICY "Allow SELECT for verified/resolved reports"
ON public.incident_reports
FOR SELECT
USING (status IN ('verified', 'resolved'));

-- FIX 2: Fix SQL injection vulnerability in storage policy
-- Drop the vulnerable policy that uses LIKE with wildcards
DROP POLICY IF EXISTS "View images for verified reports" ON storage.objects;

-- Create secure policy with exact match (no SQL wildcards)
CREATE POLICY "View images for verified reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'incident-images' AND
  EXISTS (
    SELECT 1 FROM public.incident_reports
    WHERE image_url = storage.objects.name
    AND status IN ('verified', 'resolved')
  )
);