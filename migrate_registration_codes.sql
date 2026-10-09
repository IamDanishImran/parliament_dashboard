BEGIN;

-- Update existing registration role_code values to 8-digit numeric codes
UPDATE registration SET role_code = '00000001' WHERE role_code = 'SUP';
UPDATE registration SET role_code = '00000002' WHERE role_code = 'DUN';

-- Add check constraint to enforce 8-digit numeric role_code
ALTER TABLE registration ADD CONSTRAINT registration_role_code_digits CHECK (role_code ~ '^[0-9]{8}$');

-- Insert the 5 Alor Gajah DUN registrations if not present
INSERT INTO registration(role_code, description)
SELECT code, name FROM (VALUES
 ('01000001','Rembia'),
 ('01000002','Machap Jaya'),
 ('01000003','Durian Tunggal'),
 ('01000004','Asahan'),
 ('01000005','Gadek')
) AS t(code, name)
WHERE NOT EXISTS (SELECT 1 FROM registration r WHERE r.role_code = t.code OR r.description = t.name);

COMMIT;
