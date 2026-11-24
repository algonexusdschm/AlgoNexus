-- =========================================================================
-- SECURE PASSCODES & ROW LEVEL SECURITY (RLS) MIGRATION
-- Run this in your Supabase Project -> SQL Editor
-- =========================================================================

-- 1. Ensure team_members table exists with necessary columns
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'Committee Member',
  passcode TEXT NOT NULL,
  is_event_head BOOLEAN NOT NULL DEFAULT false,
  permissions JSONB NOT NULL DEFAULT '["registrations", "checkin"]'::jsonb,
  status TEXT NOT NULL DEFAULT 'Active',
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert Default Event Head if table is empty
INSERT INTO public.team_members (id, name, email, role, passcode, is_event_head, permissions, status)
VALUES 
  ('head-001', 'Department of Data Science - Event Head', 'algonexusdschm@gmail.com', 'Event Head / Lead Organizer', 'head2026', true, '["all"]'::jsonb, 'Active'),
  ('mem-001', 'Registration & Verification Lead', 'algonexusdschm@gmail.com', 'Registration Lead', 'reg2026', false, '["registrations", "checkin"]'::jsonb, 'Active'),
  ('mem-002', 'Finance & Accounts Desk', 'algonexusdschm@gmail.com', 'Finance Lead', 'finance2026', false, '["payment-bank", "registrations"]'::jsonb, 'Active')
ON CONFLICT (id) DO NOTHING;

-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 4. Drop any existing permissive public policies that exposed passcodes
DROP POLICY IF EXISTS "Public team_members read" ON public.team_members;
DROP POLICY IF EXISTS "Allow public read of team_members" ON public.team_members;
DROP POLICY IF EXISTS "team_members_select_policy" ON public.team_members;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.team_members;

-- 5. DENY ALL DIRECT ANONYMOUS SELECT ACCESS TO team_members
-- This blocks public visitors from inspecting team_members via browser DevTools
CREATE POLICY "Deny anonymous select on team_members"
ON public.team_members
FOR SELECT
TO anon
USING (false);

-- 6. SECURE SERVER-SIDE RPC AUTHENTICATION FUNCTION
-- This function runs with SECURITY DEFINER (elevated database privilege),
-- verifies the passcode server-side, and returns ONLY safe user profile info.
-- NO PASSCODES ARE EVER SENT ACROSS THE NETWORK TO THE BROWSER!
CREATE OR REPLACE FUNCTION public.verify_admin_passcode(entered_passcode TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_trimmed TEXT;
  v_member RECORD;
BEGIN
  v_trimmed := trim(entered_passcode);

  IF v_trimmed IS NULL OR v_trimmed = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Passcode cannot be empty');
  END IF;

  -- Look up matching active member by passcode (case-insensitive)
  SELECT id, name, email, role, is_event_head, permissions, status
  INTO v_member
  FROM public.team_members
  WHERE status = 'Active' 
    AND (passcode = v_trimmed OR lower(passcode) = lower(v_trimmed))
  LIMIT 1;

  IF v_member IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'user', jsonb_build_object(
        'id', v_member.id,
        'name', v_member.name,
        'email', coalesce(v_member.email, ''),
        'role', v_member.role,
        'isEventHead', coalesce(v_member.is_event_head, false),
        'permissions', coalesce(v_member.permissions, '["registrations", "checkin"]'::jsonb)
      )
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid Passcode! Please check credentials.'
    );
  END IF;
END;
$$;

-- Grant public execute permission on the secure login function
GRANT EXECUTE ON FUNCTION public.verify_admin_passcode(TEXT) TO anon, authenticated, service_role;
