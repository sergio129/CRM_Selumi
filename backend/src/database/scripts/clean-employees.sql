-- Deshabilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar las tablas
TRUNCATE TABLE payroll;
TRUNCATE TABLE employee;

-- Habilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
