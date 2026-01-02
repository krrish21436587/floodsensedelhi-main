-- Drop and recreate the view with SECURITY INVOKER to avoid security definer issues
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

-- Re-grant select on the view
GRANT SELECT ON public.incident_reports_public TO anon;
GRANT SELECT ON public.incident_reports_public TO authenticated;

-- Update the restrictive RLS policy to allow the view to query the underlying table
DROP POLICY IF EXISTS "No direct public SELECT access" ON public.incident_reports;

-- Allow SELECT access for verified/resolved reports (for the view to work)
CREATE POLICY "Allow SELECT for verified/resolved reports only"
ON public.incident_reports
FOR SELECT
USING (status IN ('verified', 'resolved'));