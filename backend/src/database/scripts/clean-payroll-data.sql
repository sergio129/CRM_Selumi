-- Deshabilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar la tabla de nóminas
TRUNCATE TABLE payroll;

-- Reiniciar el auto-incremento
ALTER TABLE payroll AUTO_INCREMENT = 1;

-- Habilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
