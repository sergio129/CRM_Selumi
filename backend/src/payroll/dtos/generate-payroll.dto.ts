import { IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class GeneratePayrollDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsNotEmpty()
  @IsDateString()
  periodStart: string;

  @IsNotEmpty()
  @IsDateString()
  periodEnd: string;
}
