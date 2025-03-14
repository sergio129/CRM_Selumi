-- Tabla de Empleados para Nómina
CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `documentType` varchar(50) NOT NULL,
  `documentNumber` varchar(50) NOT NULL UNIQUE,
  `address` varchar(255),
  `phone` varchar(50),
  `email` varchar(255) NOT NULL UNIQUE,
  `birthDate` date,
  `gender` varchar(20),
  `position` varchar(100),
  `department` varchar(100),
  `hireDate` date,
  `contractType` varchar(50),
  `supervisor` varchar(255),
  `baseSalary` decimal(10,2) NOT NULL,
  `benefits` json,
  `deductions` json,
  `overtimeHours` decimal(10,2) DEFAULT 0,
  `overtimeRate` decimal(10,2) DEFAULT 0,
  `paymentHistory` text,
  `paymentFrequency` varchar(20) DEFAULT 'monthly',
  `bankName` varchar(100),
  `bankAccountNumber` varchar(100),
  `bankAccountType` varchar(50),
  `lastPaymentDate` date,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Nómina
CREATE TABLE `payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeId` int NOT NULL,
  `paymentPeriodStart` date NOT NULL,
  `paymentPeriodEnd` date NOT NULL,
  `baseSalary` decimal(10,2) NOT NULL,
  `benefits` json NOT NULL,
  `deductions` json NOT NULL,
  `grossSalary` decimal(10,2) NOT NULL,
  `netSalary` decimal(10,2) NOT NULL,
  `notes` text,
  `status` varchar(20) DEFAULT 'pending',
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `paidAt` timestamp NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices
CREATE INDEX idx_employee_document ON employee(documentNumber);
CREATE INDEX idx_payroll_employee ON payroll(employeeId);
CREATE INDEX idx_payroll_period ON payroll(paymentPeriodStart, paymentPeriodEnd);
