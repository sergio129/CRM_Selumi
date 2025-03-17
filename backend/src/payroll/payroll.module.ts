import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { Employee } from './employee.entity';
import { Payroll } from './payroll.entity';
import { PayrollCalculatorService } from './payroll-calculator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Payroll])
  ],
  providers: [
    PayrollService,
    PayrollCalculatorService
  ],
  controllers: [PayrollController],
  exports: [PayrollService]
})
export class PayrollModule {}
