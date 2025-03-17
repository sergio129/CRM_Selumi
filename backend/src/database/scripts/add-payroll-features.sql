-- Agregar campos para historial de pagos
ALTER TABLE employee ADD COLUMN paymentHistory JSON DEFAULT ('[]');

-- Agregar campos para gestión de turnos
ALTER TABLE employee 
ADD COLUMN workSchedule JSON DEFAULT (
  '{
    "monday": {"start": "08:00", "end": "17:00"},
    "tuesday": {"start": "08:00", "end": "17:00"},
    "wednesday": {"start": "08:00", "end": "17:00"},
    "thursday": {"start": "08:00", "end": "17:00"},
    "friday": {"start": "08:00", "end": "17:00"}
  }'
);

-- Agregar campos para beneficios adicionales
ALTER TABLE employee ADD COLUMN additionalBenefits JSON DEFAULT (
  '{
    "healthInsurance": false,
    "lifeInsurance": false,
    "gymMembership": false,
    "educationAllowance": false
  }'
);

-- Agregar tabla para préstamos internos
CREATE TABLE IF NOT EXISTS employee_loans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employeeId INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  instalments INT NOT NULL,
  remainingAmount DECIMAL(10,2) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  status ENUM('active', 'paid', 'cancelled') DEFAULT 'active',
  FOREIGN KEY (employeeId) REFERENCES employee(id)
);

-- Agregar tabla para control de asistencia
CREATE TABLE IF NOT EXISTS attendance_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employeeId INT NOT NULL,
  checkIn DATETIME NOT NULL,
  checkOut DATETIME,
  status ENUM('onTime', 'late', 'earlyLeave', 'absent') DEFAULT 'onTime',
  biometricData JSON,
  FOREIGN KEY (employeeId) REFERENCES employee(id)
);
