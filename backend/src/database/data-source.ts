import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Client } from '../clients/client.entity';
import { Transaction } from '../accounting/transaction.entity';
import { Loan } from '../loans/loan.entity';
import { Employee } from '../payroll/employee.entity';
import { Role } from '../roles/role.entity';
import { Attendance } from '../attendance/attendance.entity';
import { join } from 'path';

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Sheyo_0129',
  database: 'crm',
  entities: [User, Client, Transaction, Loan, Employee, Role, Attendance],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: true, // Habilitar logs para ver las consultas SQL
});

// Agregar manejo de errores en la conexión
try {
  dataSource.initialize().then(() => {
    console.log("Base de datos conectada exitosamente!");
    // Verificar si hay usuarios
    const userRepo = dataSource.getRepository(User);
    userRepo.find().then(users => {
      console.log(`Usuarios encontrados: ${users.length}`);
    });
  });
} catch (err) {
  console.error("Error al conectar con la base de datos:", err);
}

export default dataSource;
