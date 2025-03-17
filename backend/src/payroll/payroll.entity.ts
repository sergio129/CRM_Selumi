import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employeeId' })
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

  @Column({ 
    type: 'enum', 
    enum: ['pendiente', 'aprobado', 'pagado', 'cancelado'], 
    default: 'pendiente'
  })
  status: 'pendiente' | 'aprobado' | 'pagado' | 'cancelado';

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ type: 'json', nullable: true })
  attendanceDetails: {
    daysWorked: number;
    absences: number;
    holidays: number;
    vacationDays: number;
    sickDays: number;
  };

  @Column({ type: 'json', nullable: true })
  overtimeDetails: {
    regularOvertimeHours: number;
    holidayOvertimeHours: number;
    nightOvertimeHours: number;
    totalOvertimeAmount: number;
  };

  @Column({ type: 'json', nullable: true })
  incentives: {
    performance: number;
    attendance: number;
    leadership: number;
    other: number;
  };

  @Column({ type: 'json', nullable: true })
  taxDetails: {
    taxableIncome: number;
    taxRate: number;
    taxExemptions: number;
    finalTax: number;
  };

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'json', nullable: true })
  adjustments: {
    description: string;
    amount: number;
    type: 'addition' | 'deduction';
    date: Date;
    approvedBy: string;
  }[];
}
