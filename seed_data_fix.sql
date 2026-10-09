BEGIN;

-- =========================
-- 1. REGISTRATION TABLE
-- =========================

-- Admin (shared code)
INSERT INTO registration (role_code, description)
VALUES ('00000001', 'Admin')
ON CONFLICT (role_code) DO NOTHING;

-- Unique DUN codes
INSERT INTO registration (role_code, description) VALUES
('12345678', 'DUN Alpha'),
('87654321', 'DUN Beta'),
('11223344', 'DUN Gamma'),
('55667788', 'DUN Delta'),
('99887766', 'DUN Epsilon')
ON CONFLICT (role_code) DO NOTHING;

-- =========================
-- 2. AUTH USERS
-- =========================

DO $$
BEGIN
  -- Update existing users
  UPDATE auth.users
  SET
    encrypted_password = crypt('pass123', gen_salt('bf')),
    email_confirmed_at = now(),
    aud = 'authenticated',
    role = 'authenticated',
    raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
    updated_at = now(),
    is_sso_user = false,
    is_anonymous = false
  WHERE email IN (
    'sup1@example.com','sup2@example.com','sup3@example.com',
    'dun1@example.com','dun2@example.com','dun3@example.com',
    'dun4@example.com','dun5@example.com'
  );

  -- Insert if not exists
  INSERT INTO auth.users (
    id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at,
    is_sso_user, is_anonymous
  )
  SELECT
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    seed.email,
    crypt('pass123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now(),
    false, false
  FROM (
    VALUES
      ('sup1@example.com'),
      ('sup2@example.com'),
      ('sup3@example.com'),
      ('dun1@example.com'),
      ('dun2@example.com'),
      ('dun3@example.com'),
      ('dun4@example.com'),
      ('dun5@example.com')
  ) AS seed(email)
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.email = seed.email
  );

  -- identities
  INSERT INTO auth.identities (
    id, provider_id, user_id, identity_data,
    provider, last_sign_in_at, created_at, updated_at
  )
  SELECT
    gen_random_uuid(),
    u.email,
    u.id,
    jsonb_build_object(
      'sub', u.id::text,
      'email', u.email,
      'email_verified', true
    ),
    'email',
    now(), now(), now()
  FROM auth.users u
  WHERE u.email IN (
    'sup1@example.com','sup2@example.com','sup3@example.com',
    'dun1@example.com','dun2@example.com','dun3@example.com',
    'dun4@example.com','dun5@example.com'
  )
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities i
    WHERE i.user_id = u.id AND i.provider = 'email'
  );
END$$;

-- =========================
-- 3. ADMIN TABLE
-- =========================

INSERT INTO admin(user_id, name, email, ic, id_register, status)
SELECT
  u.id,
  CASE u.email
    WHEN 'sup1@example.com' THEN 'Supervisor One'
    WHEN 'sup2@example.com' THEN 'Supervisor Two'
    WHEN 'sup3@example.com' THEN 'Supervisor Three'
  END,
  u.email,
  CASE u.email
    WHEN 'sup1@example.com' THEN '900101010001'
    WHEN 'sup2@example.com' THEN '900101010002'
    WHEN 'sup3@example.com' THEN '900101010003'
  END,
  (SELECT id FROM registration WHERE role_code='00000001'),
  'Approved'
FROM auth.users u
WHERE u.email IN ('sup1@example.com','sup2@example.com','sup3@example.com')
AND NOT EXISTS (SELECT 1 FROM admin a WHERE a.email = u.email);

-- =========================
-- 4. DUN TABLE (UNIQUE CODES 🔥)
-- =========================

INSERT INTO dun(user_id, name, email, ic, id_register, status)
SELECT
  u.id,
  CASE u.email
    WHEN 'dun1@example.com' THEN 'DUN Alpha'
    WHEN 'dun2@example.com' THEN 'DUN Beta'
    WHEN 'dun3@example.com' THEN 'DUN Gamma'
    WHEN 'dun4@example.com' THEN 'DUN Delta'
    WHEN 'dun5@example.com' THEN 'DUN Epsilon'
  END,
  u.email,
  CASE u.email
    WHEN 'dun1@example.com' THEN '900201010001'
    WHEN 'dun2@example.com' THEN '900201010002'
    WHEN 'dun3@example.com' THEN '900201010003'
    WHEN 'dun4@example.com' THEN '900201010004'
    WHEN 'dun5@example.com' THEN '900201010005'
  END,
  CASE u.email
    WHEN 'dun1@example.com' THEN (SELECT id FROM registration WHERE role_code='12345678')
    WHEN 'dun2@example.com' THEN (SELECT id FROM registration WHERE role_code='87654321')
    WHEN 'dun3@example.com' THEN (SELECT id FROM registration WHERE role_code='11223344')
    WHEN 'dun4@example.com' THEN (SELECT id FROM registration WHERE role_code='55667788')
    WHEN 'dun5@example.com' THEN (SELECT id FROM registration WHERE role_code='99887766')
  END,
  'Approved'
FROM auth.users u
WHERE u.email LIKE 'dun%@example.com'
AND NOT EXISTS (SELECT 1 FROM dun d WHERE d.email = u.email);

-- =========================
-- 5. RELATIONSHIPS
-- =========================

INSERT INTO admin_dun(id_admin, id_dun)
SELECT a.id, d.id
FROM admin a
JOIN dun d ON
  (a.email='sup1@example.com' AND d.email IN ('dun1@example.com','dun2@example.com')) OR
  (a.email='sup2@example.com' AND d.email IN ('dun3@example.com','dun4@example.com')) OR
  (a.email='sup3@example.com' AND d.email='dun5@example.com')
WHERE NOT EXISTS (
  SELECT 1 FROM admin_dun ad
  WHERE ad.id_admin = a.id AND ad.id_dun = d.id
);

COMMIT;