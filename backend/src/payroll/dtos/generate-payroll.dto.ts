import { IsNumber, IsDateString } from 'class-validator';

export class GeneratePayrollDto {
  @IsNumber()
  employeeId: number;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;
}
