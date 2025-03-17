-- Verificar si la tabla existe y eliminarla
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS employee;

-- Crear tabla de empleados
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255) NOT NULL,
  documentType VARCHAR(50) NOT NULL,
  documentNumber VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  position VARCHAR(100),
  department VARCHAR(100),
  baseSalary DECIMAL(10,2) NOT NULL,
  benefits JSON,
  deductions JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de nómina
CREATE TABLE payroll (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employeeId INT NOT NULL,
  paymentPeriodStart DATE NOT NULL,
  paymentPeriodEnd DATE NOT NULL,
  baseSalary DECIMAL(10,2) NOT NULL,
  overtimeHours DECIMAL(5,2) DEFAULT 0,
  overtimePay DECIMAL(10,2) DEFAULT 0,
  benefits JSON,
  deductions JSON,
  grossSalary DECIMAL(10,2) NOT NULL,
  netSalary DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'approved', 'paid', 'cancelled') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  paidAt TIMESTAMP NULL,
  FOREIGN KEY (employeeId) REFERENCES employee(id) ON DELETE RESTRICT
);

-- Crear índices
CREATE INDEX idx_payroll_employee ON payroll(employeeId);
CREATE INDEX idx_payroll_period ON payroll(paymentPeriodStart, paymentPeriodEnd);
CREATE INDEX idx_payroll_status ON payroll(status);
