import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { AccountingModule } from './accounting/accounting.module';
import { LoansModule } from './loans/loans.module';
import { PayrollModule } from './payroll/payroll.module';
import { RolesModule } from './roles/roles.module';
import { BiometricModule } from './biometric/biometric.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ClientsModule,
    AccountingModule,
    LoansModule,
    PayrollModule,
    RolesModule,
    BiometricModule,
    ReportsModule,
    NotificationsModule,
    AttendanceModule,
  ],
})
export class AppModule {}