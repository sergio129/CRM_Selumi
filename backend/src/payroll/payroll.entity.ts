import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  employee: Employee;

  @Column()
  employeeId: number;

  @Column({ type: 'date' })
  paymentPeriodStart: Date;

  @Column({ type: 'date' })
  paymentPeriodEnd: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseSalary: number;

  @Column({ type: 'json' })
  benefits: {
    healthInsurance: number;
    transportationAllowance: number;
    mealAllowance: number;
    performanceBonus: number;
    overtimePay: number;
    otherBenefits: number;
  };

  @Column({ type: 'json' })
  deductions: {
    tax: number;
    pension: number;
    socialSecurity: number;
    loans: number;
    otherDeductions: number;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grossSalary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netSalary: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  paidAt: Date;
}
