-- Fix infinite recursion in user_roles RLS policies
-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;

-- Policy 1: Users can view their own role (no recursion)
CREATE POLICY "Users can view own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy 2: Allow insert for new users (needed for first admin creation)
CREATE POLICY "Allow insert for authenticated users"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy 3: Service role can do everything (for admin operations)
CREATE POLICY "Service role full access"
  ON public.user_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Note: Admin management should be done via API routes using service role key
-- This prevents infinite recursion while maintaining security
