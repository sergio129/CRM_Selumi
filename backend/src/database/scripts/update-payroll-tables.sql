-- Alteraciones para la tabla employee (ejecutar una por una)
ALTER TABLE employee ADD COLUMN baseSalary DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employee ADD COLUMN overtimeHours DECIMAL(5,2) DEFAULT 0;
ALTER TABLE employee ADD COLUMN overtimeRate DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employee ADD COLUMN bankName VARCHAR(100) NULL;
ALTER TABLE employee ADD COLUMN bankAccountNumber VARCHAR(100) NULL;
ALTER TABLE employee ADD COLUMN bankAccountType VARCHAR(50) NULL;
ALTER TABLE employee ADD COLUMN lastPaymentDate DATE NULL;
ALTER TABLE employee ADD COLUMN paymentFrequency VARCHAR(20) DEFAULT 'monthly';
ALTER TABLE employee ADD COLUMN benefits JSON NULL;
ALTER TABLE employee ADD COLUMN deductions JSON NULL;

-- Alteraciones para la tabla payroll (ejecutar una por una)
ALTER TABLE payroll ADD COLUMN approvedBy VARCHAR(100) NULL;
ALTER TABLE payroll ADD COLUMN approvedAt DATETIME NULL;
ALTER TABLE payroll ADD COLUMN isPaid BOOLEAN DEFAULT FALSE;
ALTER TABLE payroll ADD COLUMN paymentReference VARCHAR(100) NULL;
ALTER TABLE payroll ADD COLUMN paymentMethod VARCHAR(50) NULL;

-- Crear índices (ejecutar uno por uno)
CREATE INDEX idx_payroll_employee ON payroll(employeeId);
CREATE INDEX idx_payroll_period ON payroll(paymentPeriodStart, paymentPeriodEnd);
CREATE INDEX idx_payroll_status ON payroll(status);

-- Modificar el tipo de columna status con valores en español
ALTER TABLE payroll MODIFY COLUMN status ENUM('pendiente', 'aprobado', 'pagado', 'cancelado') DEFAULT 'pendiente';
