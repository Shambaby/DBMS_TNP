-- TNP DBMS Schema
-- Run this in your Railway MySQL database

CREATE DATABASE IF NOT EXISTS railway;
USE railway;

CREATE TABLE IF NOT EXISTS Admin (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone_no VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Company (
  company_id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  address TEXT,
  contact_no VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS JobOpening (
  job_id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  company_id INT NOT NULL,
  job_description TEXT NOT NULL,
  appl_deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES Admin(admin_id) ON DELETE SET NULL,
  FOREIGN KEY (company_id) REFERENCES Company(company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Student (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  dept VARCHAR(100) NOT NULL,
  cgpa DECIMAL(4,2),
  academic_backlog INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS StudentApplication (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  job_id INT NOT NULL,
  academic_backlog INT DEFAULT 0,
  date_of_application DATE DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES JobOpening(job_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Placement (
  placement_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  job_id INT NOT NULL,
  ctc DECIMAL(12,2),
  join_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES StudentApplication(application_id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES JobOpening(job_id) ON DELETE CASCADE
);

-- Sample seed data
INSERT IGNORE INTO Admin (email, password, phone_no) VALUES
  ('admin@tnp.edu', '$2a$10$examplehashedpassword', '9876543210');

INSERT IGNORE INTO Company (company_name, address, contact_no) VALUES
  ('Google India', 'Bengaluru, Karnataka', '080-12345678'),
  ('Microsoft', 'Hyderabad, Telangana', '040-98765432'),
  ('Infosys', 'Pune, Maharashtra', '020-11223344');
