-- Create a public view that excludes sensitive PII fields
CREATE VIEW public.incident_reports_public AS
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

-- Grant select on the view to anon and authenticated roles
GRANT SELECT ON public.incident_reports_public TO anon;
GRANT SELECT ON public.incident_reports_public TO authenticated;

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view verified reports" ON public.incident_reports;

-- Create a restrictive policy - only allow direct table access for authenticated users who need PII
-- (e.g., admins reviewing reports) - for now, no direct SELECT access
CREATE POLICY "No direct public SELECT access"
ON public.incident_reports
FOR SELECT
USING (false);