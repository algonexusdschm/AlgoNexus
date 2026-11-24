-- =========================================================================
-- SECURE ROW LEVEL SECURITY (RLS) & RPC PROCEDURES FOR REGISTRATIONS TABLE
-- Run this in your Supabase Project -> SQL Editor
-- =========================================================================

-- 1. Enable Row Level Security on registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing permissive policies
DROP POLICY IF EXISTS "Public can insert registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.registrations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.registrations;
DROP POLICY IF EXISTS "Enable update for all users" ON public.registrations;
DROP POLICY IF EXISTS "Block direct anon update on registrations" ON public.registrations;

-- 3. Policy: Public participants can submit their registration
CREATE POLICY "Public can insert registrations"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Policy: Public participants can find & view their passes
CREATE POLICY "Public can view registrations"
ON public.registrations
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Policy: BLOCK direct unauthorized updates by anonymous users
-- Prevents attackers from using browser console to self-verify payment status
CREATE POLICY "Block direct anon update on registrations"
ON public.registrations
FOR UPDATE
TO anon
USING (false);

-- 6. SECURE RPC PROCEDURE: admin_verify_payment
-- Only executes payment approval if the caller provides an active organizer passcode
CREATE OR REPLACE FUNCTION public.admin_verify_payment(p_ticket_id TEXT, p_passcode TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_authorized BOOLEAN;
  v_rows_updated INT;
BEGIN
  -- Verify the passcode against team_members
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE status = 'Active' 
      AND (passcode = trim(p_passcode) OR lower(passcode) = lower(trim(p_passcode)))
  ) INTO v_authorized;

  IF NOT v_authorized THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Invalid organizer passcode');
  END IF;

  -- Perform the payment approval
  UPDATE public.registrations
  SET 
    bank_name = 'STATUS:PAID'
  WHERE 
    upper(ticket_id) = upper(trim(p_ticket_id)) 
    OR id::text = trim(p_ticket_id);

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

  IF v_rows_updated > 0 THEN
    RETURN jsonb_build_object('success', true, 'rows_updated', v_rows_updated);
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'No registration found for ticket ID: ' || p_ticket_id);
  END IF;
END;
$$;

-- 7. SECURE RPC PROCEDURE: admin_gate_check_in
-- Only executes gate check-in if the caller provides an active organizer passcode
CREATE OR REPLACE FUNCTION public.admin_gate_check_in(p_ticket_id TEXT, p_passcode TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_authorized BOOLEAN;
  v_rows_updated INT;
BEGIN
  -- Verify the passcode against team_members
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE status = 'Active' 
      AND (passcode = trim(p_passcode) OR lower(passcode) = lower(trim(p_passcode)))
  ) INTO v_authorized;

  IF NOT v_authorized THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Invalid organizer passcode');
  END IF;

  -- Perform the gate check-in
  UPDATE public.registrations
  SET 
    checked_in = true,
    checked_in_at = COALESCE(checked_in_at, NOW())
  WHERE 
    upper(ticket_id) = upper(trim(p_ticket_id)) 
    OR id::text = trim(p_ticket_id);

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

  IF v_rows_updated > 0 THEN
    RETURN jsonb_build_object('success', true, 'rows_updated', v_rows_updated);
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'No registration found for ticket ID: ' || p_ticket_id);
  END IF;
END;
$$;

-- Grant execution permission to callers
GRANT EXECUTE ON FUNCTION public.admin_verify_payment(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_gate_check_in(TEXT, TEXT) TO anon, authenticated, service_role;
