-- Populate User supertype rows from existing subtype tables.
-- Run this after Admin, Student, and Company contain data.

USE railway;

INSERT INTO `User` (email, phone_no, password, user_type)
SELECT email, phone_no, SUBSTRING_INDEX(email, '@', 1), 'admin'
FROM Admin
WHERE email IS NOT NULL AND email <> ''
ON DUPLICATE KEY UPDATE
  phone_no = VALUES(phone_no),
  password = VALUES(password),
  user_type = VALUES(user_type);

INSERT INTO `User` (email, phone_no, password, user_type)
SELECT official_email, NULL, SUBSTRING_INDEX(official_email, '@', 1), 'student'
FROM Student
WHERE official_email IS NOT NULL AND official_email <> ''
ON DUPLICATE KEY UPDATE
  phone_no = VALUES(phone_no),
  password = VALUES(password),
  user_type = VALUES(user_type);

INSERT INTO `User` (email, phone_no, password, user_type)
SELECT email, contact_no, SUBSTRING_INDEX(email, '@', 1), 'company'
FROM Company
WHERE email IS NOT NULL AND email <> ''
ON DUPLICATE KEY UPDATE
  phone_no = VALUES(phone_no),
  password = VALUES(password),
  user_type = VALUES(user_type);

SELECT user_type, COUNT(*) AS row_count
FROM `User`
GROUP BY user_type
ORDER BY user_type;
