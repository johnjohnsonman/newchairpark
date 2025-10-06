-- Grant admin access to hello@chairpark.com
-- User ID: 9a98ee35-5458-498c-9381-183d027caf3f

-- Delete any existing role for this user (in case of duplicates)
DELETE FROM user_roles 
WHERE user_id = '9a98ee35-5458-498c-9381-183d027caf3f';

-- Insert admin role for hello@chairpark.com
INSERT INTO user_roles (user_id, role)
VALUES ('9a98ee35-5458-498c-9381-183d027caf3f', 'admin');

-- Verify the insertion
SELECT 
  ur.user_id,
  ur.role,
  ur.created_at
FROM user_roles ur
WHERE ur.user_id = '9a98ee35-5458-498c-9381-183d027caf3f';
