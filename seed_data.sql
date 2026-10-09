BEGIN;

-- Insert admins (Supervisors)
INSERT INTO admin(user_id, name, email, ic, id_register, status) VALUES
 (gen_random_uuid(),'Supervisor One','sup1@example.com','900101010001', (SELECT id FROM registration WHERE role_code='SUP'), 'Approved'),
 (gen_random_uuid(),'Supervisor Two','sup2@example.com','900101010002', (SELECT id FROM registration WHERE role_code='SUP'), 'Approved'),
 (gen_random_uuid(),'Supervisor Three','sup3@example.com','900101010003', (SELECT id FROM registration WHERE role_code='SUP'), 'Approved');

-- Insert DUNs
INSERT INTO dun(user_id, name, email, ic, id_register, status) VALUES
 (gen_random_uuid(),'DUN Alpha','dun1@example.com','900201010001', (SELECT id FROM registration WHERE role_code='DUN'), 'Approved'),
 (gen_random_uuid(),'DUN Beta','dun2@example.com','900201010002', (SELECT id FROM registration WHERE role_code='DUN'), 'Approved'),
 (gen_random_uuid(),'DUN Gamma','dun3@example.com','900201010003', (SELECT id FROM registration WHERE role_code='DUN'), 'Approved'),
 (gen_random_uuid(),'DUN Delta','dun4@example.com','900201010004', (SELECT id FROM registration WHERE role_code='DUN'), 'Approved'),
 (gen_random_uuid(),'DUN Epsilon','dun5@example.com','900201010005', (SELECT id FROM registration WHERE role_code='DUN'), 'Approved');

-- Link admins to duns
INSERT INTO admin_dun(id_admin, id_dun)
 SELECT a.id, d.id FROM admin a JOIN dun d ON a.email='sup1@example.com' AND d.email='dun1@example.com';
INSERT INTO admin_dun(id_admin, id_dun)
 SELECT a.id, d.id FROM admin a JOIN dun d ON a.email='sup1@example.com' AND d.email='dun2@example.com';
INSERT INTO admin_dun(id_admin, id_dun)
 SELECT a.id, d.id FROM admin a JOIN dun d ON a.email='sup2@example.com' AND d.email='dun3@example.com';
INSERT INTO admin_dun(id_admin, id_dun)
 SELECT a.id, d.id FROM admin a JOIN dun d ON a.email='sup2@example.com' AND d.email='dun4@example.com';
INSERT INTO admin_dun(id_admin, id_dun)
 SELECT a.id, d.id FROM admin a JOIN dun d ON a.email='sup3@example.com' AND d.email='dun5@example.com';

-- Insert forms (complaints/requests)
INSERT INTO form(notes, category, category_type, quantity, price, address, phone, help_type, item, form_status, id_dun) VALUES
 ('Need rice and milk','Food','Basic',50,0,'Area 1','0123000001','Food','Rice','Open', (SELECT id FROM dun WHERE email='dun1@example.com')) ,
 ('Elderly needs transport','Transport','Assistance',1,0,'Area 2','0123000002','Transport','Vehicle','Open', (SELECT id FROM dun WHERE email='dun1@example.com')) ,
 ('House repair required','Housing','Repair',1,0,'Area 3','0123000003','Housing','Repair','Open', (SELECT id FROM dun WHERE email='dun2@example.com')) ,
 ('Medical aid for child','Medical','Aid',1,0,'Area 4','0123000004','Medical','Medication','Open', (SELECT id FROM dun WHERE email='dun3@example.com')) ,
 ('School supplies','Education','Supplies',30,0,'Area 5','0123000005','Education','Books','Open', (SELECT id FROM dun WHERE email='dun4@example.com')) ,
 ('Small business grant','Economic','Grant',1,5000,'Area 6','0123000006','Economic','Grant','Open', (SELECT id FROM dun WHERE email='dun5@example.com')) ,
 ('Monthly food pack','Food','Basic',100,0,'Area 7','0123000007','Food','Food Pack','Open', (SELECT id FROM dun WHERE email='dun2@example.com')) ,
 ('Wheelchair for elderly','Medical','Equipment',1,0,'Area 8','0123000008','Medical','Wheelchair','Open', (SELECT id FROM dun WHERE email='dun3@example.com')) ,
 ('Flood relief','Housing','Emergency',20,0,'Area 9','0123000009','Housing','Relief Pack','Open', (SELECT id FROM dun WHERE email='dun4@example.com')) ,
 ('Job placement assistance','Economic','Employment',5,0,'Area 10','0123000010','Economic','Job Support','Open', (SELECT id FROM dun WHERE email='dun5@example.com'));

-- Link some forms to admins via form_admin
INSERT INTO form_admin(id_admin, id_form)
 SELECT a.id, f.id FROM admin a JOIN form f ON a.email='sup1@example.com' AND f.notes LIKE '%rice%' ;
INSERT INTO form_admin(id_admin, id_form)
 SELECT a.id, f.id FROM admin a JOIN form f ON a.email='sup2@example.com' AND f.notes LIKE '%Medical%';
INSERT INTO form_admin(id_admin, id_form)
 SELECT a.id, f.id FROM admin a JOIN form f ON a.email='sup3@example.com' AND f.notes LIKE '%business%';

-- Insert email/complaint records
INSERT INTO email(title, complaint, status, id_dun) VALUES
 ('Noise complaint','Loud party ongoing at night','Open', (SELECT id FROM dun WHERE email='dun1@example.com')) ,
 ('Road potholes','Dangerous potholes on main road','Open', (SELECT id FROM dun WHERE email='dun2@example.com')) ,
 ('Garbage overflow','Garbage collection missed this week','Open', (SELECT id FROM dun WHERE email='dun3@example.com'));

-- Insert sample stats_monthly records
INSERT INTO stats_monthly(month, year, total_form, id_form) VALUES
 (1, 2026, 5, (SELECT id FROM form ORDER BY id LIMIT 1)),
 (2, 2026, 8, (SELECT id FROM form ORDER BY id LIMIT 1 OFFSET 1)),
 (3, 2026, 10, (SELECT id FROM form ORDER BY id LIMIT 1 OFFSET 2));

COMMIT;
