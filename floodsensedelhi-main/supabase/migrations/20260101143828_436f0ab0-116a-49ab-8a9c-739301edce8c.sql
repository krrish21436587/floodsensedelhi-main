-- Remove direct SELECT access to the table (PII protection)
DROP POLICY IF EXISTS "Allow SELECT for verified/resolved reports only" ON public.incident_reports;

-- Drop and recreate view as SECURITY DEFINER to allow access without direct table RLS
-- This is safe because the view explicitly excludes reporter_name and reporter_phone
DROP VIEW IF EXISTS public.incident_reports_public;

CREATE VIEW public.incident_reports_public
WITH (security_barrier = true)
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