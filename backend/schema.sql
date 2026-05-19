CREATE DATABASE IF NOT EXISTS hr_nexus_db;
USE hr_nexus_db;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  manager VARCHAR(100),
  description TEXT,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  dateOfBirth DATE,
  gender CHAR(1),
  department VARCHAR(100),
  position VARCHAR(100),
  joinDate DATE,
  profilePicture VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  basic_salary DECIMAL(10,2) DEFAULT 0,
  hra DECIMAL(10,2) DEFAULT 0,
  da DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employeeId INT NOT NULL,
  date DATE NOT NULL,
  checkInTime DATETIME,
  checkOutTime DATETIME,
  status VARCHAR(20) DEFAULT 'present',
  workingHours DECIMAL(5,2) DEFAULT 0,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leaves_request (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employeeId INT NOT NULL,
  leaveType VARCHAR(50),
  startDate DATE,
  endDate DATE,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payroll (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employeeId INT NOT NULL,
  month VARCHAR(7) NOT NULL,
  basic_salary DECIMAL(10,2) DEFAULT 0,
  hra DECIMAL(10,2) DEFAULT 0,
  da DECIMAL(10,2) DEFAULT 0,
  gross_salary DECIMAL(10,2) DEFAULT 0,
  pf DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  net_salary DECIMAL(10,2) DEFAULT 0,
  processedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_payroll (employeeId, month),
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);
