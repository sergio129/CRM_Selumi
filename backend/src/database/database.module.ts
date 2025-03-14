import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Client } from '../clients/client.entity';
import { Transaction } from '../accounting/transaction.entity';
import { Loan } from '../loans/loan.entity';
import { Employee } from '../payroll/employee.entity';
import { Role } from '../roles/role.entity';
import { Attendance } from '../attendance/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Sheyo_0129',
      database: 'crm',
      entities: [User, Client, Transaction, Loan, Employee, Role, Attendance],
      synchronize: true, // Cambiado a true temporalmente para debug
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
