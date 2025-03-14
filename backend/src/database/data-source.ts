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
  logging: true,
});

try {
  dataSource.initialize();
  console.log("Data Source has been initialized!");
} catch (err) {
  console.error("Error during Data Source initialization:", err);
}

export default dataSource;
