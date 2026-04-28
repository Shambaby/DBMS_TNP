SELECT 'Admin' AS table_name, COUNT(*) AS row_count FROM Admin
UNION ALL SELECT 'Company', COUNT(*) FROM Company
UNION ALL SELECT 'JobOpening', COUNT(*) FROM JobOpening
UNION ALL SELECT 'Student', COUNT(*) FROM Student
UNION ALL SELECT 'StudentApplication', COUNT(*) FROM StudentApplication
UNION ALL SELECT 'Placement', COUNT(*) FROM Placement;
