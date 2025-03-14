-- Función para verificar y agregar columnas si no existen
SET @dbname = DATABASE();

-- Verificar y agregar benefits
SELECT IF(
    EXISTS(
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = 'employee' 
        AND COLUMN_NAME = 'benefits'
    ),
    'SELECT 1',
    'ALTER TABLE employee ADD COLUMN benefits JSON NULL'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar y agregar deductions
SELECT IF(
    EXISTS(
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = 'employee' 
        AND COLUMN_NAME = 'deductions'
    ),
    'SELECT 1',
    'ALTER TABLE employee ADD COLUMN deductions JSON NULL'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar y agregar overtimeHours
SELECT IF(
    EXISTS(
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = 'employee' 
        AND COLUMN_NAME = 'overtimeHours'
    ),
    'SELECT 1',
    'ALTER TABLE employee ADD COLUMN overtimeHours DECIMAL(10,2) DEFAULT 0'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Continuar con el resto de las columnas de la misma manera
SELECT IF(
    EXISTS(
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = 'employee' 
        AND COLUMN_NAME = 'overtimeRate'
    ),
    'SELECT 1',
    'ALTER TABLE employee ADD COLUMN overtimeRate DECIMAL(10,2) DEFAULT 0'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Resto de columnas
ALTER TABLE employee
ADD COLUMN paymentFrequency VARCHAR(20) DEFAULT 'monthly',
ADD COLUMN bankName VARCHAR(100) NULL,
ADD COLUMN bankAccountNumber VARCHAR(100) NULL,
ADD COLUMN bankAccountType VARCHAR(50) NULL,
ADD COLUMN lastPaymentDate DATE NULL,
ADD COLUMN baseSalary DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Verificar y crear índices
SELECT IF(
    EXISTS(
        SELECT * FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = 'employee' 
        AND INDEX_NAME = 'idx_employee_document'
    ),
    'SELECT 1',
    'CREATE INDEX idx_employee_document ON employee(documentNumber)'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT IF(
    EXISTS(
        SELECT * FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = 'employee' 
        AND INDEX_NAME = 'idx_employee_payment'
    ),
    'SELECT 1',
    'CREATE INDEX idx_employee_payment ON employee(lastPaymentDate)'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Inicializar valores JSON para registros existentes
UPDATE employee SET
    benefits = JSON_OBJECT(
        'healthInsurance', 0,
        'transportationAllowance', 0,
        'mealAllowance', 0,
        'performanceBonus', 0
    )
WHERE benefits IS NULL;

UPDATE employee SET
    deductions = JSON_OBJECT(
        'tax', 0,
        'pension', 0,
        'socialSecurity', 0,
        'loans', 0
    )
WHERE deductions IS NULL;
